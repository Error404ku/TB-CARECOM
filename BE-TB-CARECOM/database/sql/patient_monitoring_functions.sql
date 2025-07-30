-- PostgreSQL Functions for Patient Monitoring Status Check
-- This file contains functions to check and reset patient treatment dates

-- Function to check and reset patient treatment dates
CREATE OR REPLACE FUNCTION daily_check_and_reset_treatment_dates()
RETURNS TABLE(
    updated_patients_count INTEGER,
    message TEXT
) AS $$
DECLARE
    updated_count INTEGER := 0;
BEGIN
    -- Update patients who are late with monitoring and reset their start_treatment_date
    UPDATE patients 
    SET 
        start_treatment_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP
    WHERE 
        status = 'aktif' 
        AND (
            -- Patients who have never submitted logs and it's been more than 24 hours since start_treatment_date
            (
                id NOT IN (SELECT DISTINCT patient_id FROM daily_monitoring_logs)
                AND start_treatment_date < CURRENT_DATE - INTERVAL '1 day'
            )
            OR
            -- Patients whose last log submission was more than 24 hours ago
            (
                id IN (
                    SELECT patient_id 
                    FROM daily_monitoring_logs 
                    WHERE patient_id = patients.id
                    GROUP BY patient_id 
                    HAVING MAX(created_at) < CURRENT_TIMESTAMP - INTERVAL '24 hours'
                )
            )
        );
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RETURN QUERY SELECT 
        updated_count,
        CASE 
            WHEN updated_count > 0 THEN 
                'Reset treatment dates for ' || updated_count || ' patients who were late with monitoring'
            ELSE 
                'No patients needed treatment date reset'
        END;
END;
$$ LANGUAGE plpgsql;

-- Function to check patient monitoring status and update to 'gagal' if needed
CREATE OR REPLACE FUNCTION check_patient_monitoring_status()
RETURNS TABLE(
    updated_patients_count INTEGER,
    message TEXT
) AS $$
DECLARE
    updated_count INTEGER := 0;
BEGIN
    -- Update patient status to 'gagal' for patients who haven't submitted logs within 24 hours
    UPDATE patients 
    SET 
        status = 'gagal',
        updated_at = CURRENT_TIMESTAMP
    WHERE 
        status = 'aktif' 
        AND (
            -- Patients who have never submitted logs and it's been more than 24 hours since start_treatment_date
            (
                id NOT IN (SELECT DISTINCT patient_id FROM daily_monitoring_logs)
                AND start_treatment_date < CURRENT_DATE - INTERVAL '1 day'
            )
            OR
            -- Patients whose last log submission was more than 24 hours ago
            (
                id IN (
                    SELECT patient_id 
                    FROM daily_monitoring_logs 
                    WHERE patient_id = patients.id
                    GROUP BY patient_id 
                    HAVING MAX(created_at) < CURRENT_TIMESTAMP - INTERVAL '24 hours'
                )
            )
        );
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RETURN QUERY SELECT 
        updated_count,
        CASE 
            WHEN updated_count > 0 THEN 
                'Updated ' || updated_count || ' patients to failed status due to late monitoring'
            ELSE 
                'No patients needed status update'
        END;
END;
$$ LANGUAGE plpgsql;

-- Function to reset patient treatment date (called by trigger)
CREATE OR REPLACE FUNCTION reset_patient_treatment_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Reset start_treatment_date for patients who were late but now submitted a log
    UPDATE patients 
    SET 
        start_treatment_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP
    WHERE 
        id = NEW.patient_id
        AND status = 'aktif'
        AND (
            -- Patient had no previous logs and it's been more than 24 hours since start_treatment_date
            (
                id NOT IN (
                    SELECT DISTINCT patient_id 
                    FROM daily_monitoring_logs 
                    WHERE patient_id = NEW.patient_id 
                    AND id != NEW.id
                )
                AND start_treatment_date < CURRENT_DATE - INTERVAL '1 day'
            )
            OR
            -- Patient's previous log was more than 24 hours ago
            (
                id IN (
                    SELECT patient_id 
                    FROM daily_monitoring_logs 
                    WHERE patient_id = NEW.patient_id 
                    AND id != NEW.id
                    GROUP BY patient_id 
                    HAVING MAX(created_at) < CURRENT_TIMESTAMP - INTERVAL '24 hours'
                )
            )
        );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to reset treatment date after monitoring log insert
DROP TRIGGER IF EXISTS trigger_reset_treatment_date ON daily_monitoring_logs;
CREATE TRIGGER trigger_reset_treatment_date
    AFTER INSERT ON daily_monitoring_logs
    FOR EACH ROW
    EXECUTE FUNCTION reset_patient_treatment_date();

-- Function to check and update patient status after monitoring log insert
CREATE OR REPLACE FUNCTION trigger_check_patient_status()
RETURNS TRIGGER AS $$
BEGIN
    -- This function is called after each monitoring log insert
    -- It checks all active patients and updates status if needed
    PERFORM check_patient_monitoring_status();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check patient status after monitoring log insert
DROP TRIGGER IF EXISTS after_monitoring_insert ON daily_monitoring_logs;
CREATE TRIGGER after_monitoring_insert
    AFTER INSERT ON daily_monitoring_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_check_patient_status();