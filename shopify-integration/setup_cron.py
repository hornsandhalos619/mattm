#!/usr/bin/env python3
"""
Cron job setup for automated dropship sync.
Run this once to register the scheduled job.
"""

import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
SYNC_SCRIPT = SCRIPT_DIR / "dropship_sync.py"
TOKEN_REFRESH = SCRIPT_DIR / "shopify_token_refresh.py"

def setup_cron():
    """Set up cron jobs via Windows Task Scheduler or cron."""
    
    # For Windows - use Task Scheduler
    if sys.platform == "win32":
        print("Setting up Windows Task Scheduler jobs...")
        
        # Dropship sync every 6 hours
        sync_cmd = f'python "{SYNC_SCRIPT}"'
        token_cmd = f'python "{TOKEN_REFRESH}"'
        
        # Create tasks
        tasks = [
            {
                "name": "HornsHalos_DropshipSync",
                "command": f'cmd /c {sync_cmd}',
                "schedule": "HOURLY",
                "modifier": 6,  # every 6 hours
            },
            {
                "name": "HornsHalos_TokenRefresh",
                "command": f'cmd /c {token_cmd}',
                "schedule": "DAILY",
                "modifier": 1,  # daily (token lasts 24h)
            },
        ]
        
        for task in tasks:
            schtasks_cmd = [
                "schtasks", "/create",
                "/tn", task["name"],
                "/tr", task["command"],
                "/sc", task["schedule"],
                "/mo", str(task["modifier"]),
                "/f",  # force overwrite
            ]
            try:
                result = subprocess.run(schtasks_cmd, capture_output=True, text=True)
                if result.returncode == 0:
                    print(f"✅ Created task: {task['name']}")
                else:
                    print(f"❌ Failed to create {task['name']}: {result.stderr}")
            except Exception as e:
                print(f"❌ Error creating {task['name']}: {e}")
    
    else:
        # Linux/Mac - use crontab
        print("Setting up crontab entries...")
        cron_entries = [
            "0 */6 * * * cd /c/Users/mattm/HA.OS && python dropship_sync.py >> logs/dropship_sync.log 2>&1",
            "0 2 * * * cd /c/Users/mattm/HA.OS && python shopify_token_refresh.py >> logs/token_refresh.log 2>&1",
        ]
        
        for entry in cron_entries:
            print(f"Add to crontab: {entry}")
        print("\nRun: (crontab -l; echo '...') | crontab -")


def test_scripts():
    """Test that scripts run without errors."""
    print("Testing scripts...")
    
    for script in [SYNC_SCRIPT, TOKEN_REFRESH]:
        if script.exists():
            result = subprocess.run(
                [sys.executable, "-m", "py_compile", str(script)],
                capture_output=True, text=True
            )
            if result.returncode == 0:
                print(f"✅ {script.name} syntax OK")
            else:
                print(f"❌ {script.name} syntax error: {result.stderr}")
        else:
            print(f"❌ {script.name} not found")


if __name__ == "__main__":
    test_scripts()
    setup_cron()