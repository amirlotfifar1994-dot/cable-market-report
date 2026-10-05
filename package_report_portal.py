"""Package report pages and assets; image bundle links use the published site."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).parent
PUBLIC_ROOT = 'https://amirlotfifar1994-dot.github.io/cable-market-report/'
IMAGE_PACKAGES = ['woodmart-template-images.zip','woodmart-commerce-images.zip','woodmart-slider-images.zip']

def package():
    staging=ROOT/'tmp/package-staging'
    staging.mkdir(parents=True,exist_ok=True)
    slider_files=sorted((ROOT/'assets/templates/woodmart-sliders').glob('*.png'))
    slider_files+=sorted((ROOT/'assets/woodmart-studio').glob('*.webp'))
    slider_files+=sorted((ROOT/'assets/editorial-2026').glob('*'))
    slider_files+=sorted((ROOT/'assets/optimized').rglob('*'))
    slider_files+=sorted((ROOT/'assets/fonts').glob('*'))
    slider_files+=[ROOT/name for name in [
        'woodmart-slider-render.html','woodmart-slider-render.js','woodmart-slider-render.css',
        'woodmart-customer-pages.js','woodmart-customer-pages.css','woodmart-commerce-render.js',
        'woodmart-commerce-render.css','woodmart-build-brief.md','security.html','security-details.css',
        'security-details.js','security-implementation-brief.md','seo-roadmap.html','seo-roadmap.js',
        'seo-keyword-map-template.csv','diplomsara-seo-observations.md','implementation-reports.css',
        'reports-site.css','reports-site.js','page-motion.js','page-visuals.css','client-brief.html',
        'report-loading.js','report-loading.css','report-media-map.js',
        'client-brief.css','client-brief.js','portal-review.md','service-plans.html',
        'service-plans.css','service-plans.js','service-plans-lock.css','service-plans-lock.js',
        'assets/cable-technical-editorial.webp']]
    slider_archive=staging/'woodmart-slider-images.zip'
    with ZipFile(slider_archive,'w',ZIP_DEFLATED,compresslevel=6) as z:
        for p in slider_files:
            if p.is_file():z.write(p,p.relative_to(ROOT).as_posix())

    files=sorted((ROOT/'assets').rglob('*'))+sorted((ROOT/'competitor-screenshots').rglob('*'))
    files += [p for p in ROOT.iterdir() if p.is_file() and (p.suffix in ['.html','.css','.js','.cjs','.py','.md','.csv','.json'] or p.name=='.nojekyll' or (p.name.startswith('service-plan-') and p.suffix=='.txt'))]
    portal_archive=staging/'cable-report-portal.zip'
    with ZipFile(portal_archive,'w',ZIP_DEFLATED,compresslevel=6) as z:
        for p in files:
            if not p.is_file():continue
            name=p.relative_to(ROOT).as_posix()
            if p.suffix=='.html':
                content=p.read_text(encoding='utf-8')
                for item in IMAGE_PACKAGES:
                    content=content.replace('href="'+item+'"','href="'+PUBLIC_ROOT+item+'"')
                z.writestr(name,content.encode('utf-8'))
            else:z.write(p,name)
    for archive in [slider_archive,portal_archive]:
        archive.replace(ROOT/archive.name)
    for name in ['woodmart-slider-images.zip','cable-report-portal.zip']:
        print(f'{name}: {(ROOT/name).stat().st_size/1024/1024:.2f} MiB')

if __name__=='__main__':package()
