from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent
dest=root/'assets/templates/barad'
dest.mkdir(parents=True,exist_ok=True)
total=0
for p in (root/'tmp/barad-captures').glob('*.png'):
    with Image.open(p) as im:
        target=dest/(p.stem+'.webp')
        im.convert('RGB').save(target,'WEBP',quality=82,method=6)
        total+=target.stat().st_size
print(f'WebP screenshots: {total/1024/1024:.2f} MB total')
