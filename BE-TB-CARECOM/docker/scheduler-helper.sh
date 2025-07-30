#!/bin/bash

# Laravel Scheduler Helper Script for Docker
# Usage: ./docker/scheduler-helper.sh [command]

set -e

CONTAINER_NAME="tb-carecom-app"
LOG_FILE="/var/log/supervisor/laravel-scheduler.log"

function show_help() {
    echo "Laravel Scheduler Helper for Docker"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status      - Show scheduler status"
    echo "  logs        - Show scheduler logs (real-time)"
    echo "  restart     - Restart scheduler service"
    echo "  test        - Run scheduler command manually"
    echo "  list        - List all scheduled tasks"
    echo "  deploy      - Deploy and start containers"
    echo "  monitor     - Monitor all services"
    echo "  debug       - Show debug information"
    echo "  help        - Show this help message"
}

function check_container() {
    if ! docker ps | grep -q $CONTAINER_NAME; then
        echo "Error: Container $CONTAINER_NAME is not running"
        echo "Run: docker-compose up -d"
        exit 1
    fi
}

function show_status() {
    echo "=== Scheduler Status ==="
    check_container
    docker exec $CONTAINER_NAME supervisorctl status laravel-scheduler
    echo ""
    echo "=== Last 10 log entries ==="
    docker exec $CONTAINER_NAME tail -10 $LOG_FILE 2>/dev/null || echo "No logs found yet"
}

function show_logs() {
    echo "=== Following scheduler logs (Ctrl+C to exit) ==="
    check_container
    docker exec $CONTAINER_NAME tail -f $LOG_FILE
}

function restart_scheduler() {
    echo "=== Restarting Laravel Scheduler ==="
    check_container
    docker exec $CONTAINER_NAME supervisorctl restart laravel-scheduler
    echo "Scheduler restarted successfully"
    sleep 2
    show_status
}

function test_command() {
    echo "=== Testing scheduler command manually ==="
    check_container
    docker exec $CONTAINER_NAME php artisan patients:check-treatment-dates
    echo "Manual test completed"
}

function list_tasks() {
    echo "=== Scheduled Tasks ==="
    check_container
    docker exec $CONTAINER_NAME php artisan schedule:list
}

function deploy() {
    echo "=== Deploying TB-CARECOM with Scheduler ==="
    echo "Building containers..."
    docker-compose build
    
    echo "Starting containers..."
    docker-compose up -d
    
    echo "Waiting for services to start..."
    sleep 10
    
    echo "Checking services status..."
    docker exec $CONTAINER_NAME supervisorctl status
    
    echo "Testing scheduler..."
    test_command
    
    echo "Deployment completed successfully!"
}

function monitor() {
    echo "=== Monitoring All Services ==="
    check_container
    
    echo "--- Container Status ---"
    docker ps | grep $CONTAINER_NAME
    
    echo ""
    echo "--- Supervisor Status ---"
    docker exec $CONTAINER_NAME supervisorctl status
    
    echo ""
    echo "--- Scheduler Tasks ---"
    docker exec $CONTAINER_NAME php artisan schedule:list
    
    echo ""
    echo "--- Recent Scheduler Logs ---"
    docker exec $CONTAINER_NAME tail -20 $LOG_FILE 2>/dev/null || echo "No scheduler logs found"
    
    echo ""
    echo "--- System Resources ---"
    docker stats $CONTAINER_NAME --no-stream
}

function debug_info() {
    echo "=== Debug Information ==="
    check_container
    
    echo "--- Environment ---"
    docker exec $CONTAINER_NAME php artisan env
    
    echo ""
    echo "--- Database Connection ---"
    docker exec $CONTAINER_NAME php artisan tinker --execute="echo 'DB Connection: ' . (DB::connection()->getPdo() ? 'OK' : 'FAILED');"
    
    echo ""
    echo "--- Artisan Commands ---"
    docker exec $CONTAINER_NAME php artisan list | grep patients
    
    echo ""
    echo "--- File Permissions ---"
    docker exec $CONTAINER_NAME ls -la /var/www/html/storage/logs/
    
    echo ""
    echo "--- Supervisor Logs ---"
    docker exec $CONTAINER_NAME tail -10 /var/log/supervisor/supervisord.log
}

# Main script logic
case "${1:-help}" in
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    restart)
        restart_scheduler
        ;;
    test)
        test_command
        ;;
    list)
        list_tasks
        ;;
    deploy)
        deploy
        ;;
    monitor)
        monitor
        ;;
    debug)
        debug_info
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac