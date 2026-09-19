python3 -c "
import os
from pathlib import Path

# Anchors directly to current working directory
root = Path.cwd()
base = root / 'assets' / 'images' / 'streets'
base.mkdir(parents=True, exist_ok=True)

streets = [
  'albany-street', 'agincourt-street', 'ailesbury-street', 'argyle-street',
  'adelaide-street', 'aragon-street', 'alderney-street', 'the-turnstiles',
  'glassworks-cottages', 'malpas-road', 'goodrich-crescent', 'walford-street',
  'ross-lane', 'malpas-lane', 'pant-road', 'pant-lane', 'ross-street',
  'jewell-lane', 'aston-crescent', 'prospect-street', 'chelston-place',
  'spring-street', 'crindau-road', 'redland-street', 'brynglas-street',
  'brynglas-avenue', 'brynglas-road', 'bryn-bevan', 'brynglas-drive',
  'brynglas-court', 'lyne-road', 'edwin-street', 'evans-street',
  'tetbury-close', 'salisbury-close', 'ledbury-drive', 'glastonbury-close',
  'malmesbury-close', 'shrewsbury-close', 'tewkesbury-walk', 'shaftesbury-street',
  'hoskins-street', 'wheeler-street', 'pugsley-street', 'hewertson-street',
  'henry-street'
]

for s in streets:
    (base / s).mkdir(parents=True, exist_ok=True)

print(f'Verifying directory: {base.resolve()}')
print(f'Found {len(list(base.iterdir()))} folders inside streets/')
"