"""Publish the plans as an encrypted static page; local inputs stay private.

This limits casual access on GitHub Pages, not access to prior Git commits.
Keep the password and plaintext sources under the ignored private/ directory.
"""
from pathlib import Path
import base64
import json
import secrets
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT = Path(__file__).parent
ITERATIONS = 310_000
CONTEXT = b'cable-service-plans-v1'


def protect_page(private_dir=ROOT/'private', target=ROOT/'service-plans.html'):
    password=(private_dir/'service-plans.password').read_text('utf-8').strip()
    if not password:
        raise ValueError('The local service plans password is empty.')
    names=['service-plans.json', 'service-plans-proposal.md',
           'service-plan-catalog.txt', 'service-plan-commerce.txt',
           'service-plan-seo.txt', 'service-plan-growth.txt']
    payload={'html':(private_dir/'service-plans.html').read_text('utf-8'),
             'downloads':{name:(private_dir/name).read_text('utf-8-sig') for name in names}}
    salt=secrets.token_bytes(16)
    iv=secrets.token_bytes(12)
    key=PBKDF2HMAC(algorithm=hashes.SHA256(),length=32,salt=salt,
                  iterations=ITERATIONS).derive(password.encode('utf-8'))
    ciphertext=AESGCM(key).encrypt(iv,json.dumps(payload,ensure_ascii=False).encode('utf-8'),CONTEXT)
    b64=lambda value:base64.b64encode(value).decode('ascii')
    envelope=json.dumps({'version':1,'iterations':ITERATIONS,
                         'salt':b64(salt),'iv':b64(iv),'ciphertext':b64(ciphertext)},separators=(',',':'))
    template=(ROOT/'service-plans-lock-template.html').read_text('utf-8')
    target.write_text(template.replace('<!--ENCRYPTED_PLANS-->',
                      '<script id="sp-encrypted" type="application/json">'+envelope+'</script>'),encoding='utf-8')
    print('Published encrypted service plans; plaintext downloads remain local.')


if __name__=='__main__':
    protect_page()
