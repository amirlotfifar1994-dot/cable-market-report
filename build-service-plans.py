"""Build the password-protected report from local, unpublished inputs."""
from pathlib import Path
import runpy

ROOT=Path(__file__).parent
builder=ROOT/'private'/'build-service-plans.py'
if not builder.is_file():
    raise SystemExit('The ignored private/ plans sources are required for rebuilding.')
runpy.run_path(str(builder),run_name='__main__')
