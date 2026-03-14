       const ads = [
            // IMAGE ADS (most common)
            {
                type: 'image',
                name: 'techpicks728x90',
                imageUrl: 'a-images/techpicks728x90.jpg',
                clickUrl: 'https://eblackdiamond.com/techpicks.html'
            },
            {
                type: 'image',
                name: 'Helium10',
                imageUrl: 'a-images/helium10.jpg',
                clickUrl: 'https://i.helium10.com/n4LGnX'
            },
            // {
            //     type: 'image',
            //     name: 'Deal 3',
            //     imageUrl: 'a-images/techpicks728x90.jpg',
            //     clickUrl: 'https://example.com/affiliate-link-3'
            // },
            // SCRIPT AD (paste your affiliate <script> here)
            {
                type: 'script',
                name: 'Shopify',
                scriptCode: `
                    <a rel="sponsored"
           href="https://shopify.pxf.io/c/7052306/3797169/13624" target="_top" id="3797169">
<img src="//a.impactradius-go.com/display-ad/13624-3797169" border="0" alt="shopify-start-free" width="728" height="90"/></a><img height="0" width="0" src="https://imp.pxf.io/i/7052306/3797169/13624" style="position:absolute;visibility:hidden;" border="0" />
                `
            },
            {
                type: 'script',
                name: 'ZeroBounce',
                scriptCode: `
                            <a rel="sponsored"
           href="https://aff.zerobounce.net/c/7052306/3245139/31392" target="_top" id="3245139">
<img src="//a.impactradius-go.com/display-ad/31392-3245139" border="0" alt="" width="728" height="90"/></a><img height="0" width="0" src="https://imp.pxf.io/i/7052306/3245139/31392" style="position:absolute;visibility:hidden;" border="0" />
                `
            },
            {
                type: 'script',
                name: 'NordVPN',
                scriptCode: `
                            <a rel="sponsored"
           href="https://nordvpn.sjv.io/c/7052306/512104/7452" target="_top" id="512104">
<img src="//a.impactradius-go.com/display-ad/7452-512104" border="0" alt="" width="728" height="90"/></a><img height="0" width="0" src="https://nordvpn.sjv.io/i/7052306/512104/7452" style="position:absolute;visibility:hidden;" border="0" />
                `
            }
            // ADD MORE: { type: 'image', imageUrl: 'YOUR_URL', clickUrl: 'YOUR_LINK' }
        ];

        // =============================================
        // RANDOM LOGIC (pure random on each refresh)
        // =============================================
        const loadKey = 'adLoadCount';
        let loadCount = parseInt(localStorage.getItem(loadKey) || '0') + 1;
        localStorage.setItem(loadKey, loadCount.toString());
        
        const ad = ads[Math.floor(Math.random() * ads.length)];

        // =============================================
        // RENDER AD
        // =============================================
        function renderAd() {
            const banner = document.getElementById('adBanner');
            const content = banner.querySelector('.loading');
            content.style.display = 'none';

            if (!ad) return;

            // document.getElementById('loadCount').textContent = loadCount;
            // document.getElementById('currentAd').textContent = ad.name || 'Random Ad';

            if (ad.type === 'image') {
                const a = document.createElement('a');
                a.href = ad.clickUrl || '#';
                a.target = '_blank';
                a.rel = 'noopener noreferrer';

                const img = document.createElement('img');
                img.src = ad.imageUrl;
                img.alt = ad.name || 'Ad';

                a.appendChild(img);
                banner.appendChild(a);
            } else if (ad.type === 'script') {
                const temp = document.createElement('div');
                temp.innerHTML = ad.scriptCode;
                const scripts = temp.querySelectorAll('script');
                
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    if (script.src) newScript.src = script.src;
                    else newScript.textContent = script.textContent;
                    script.parentNode.replaceChild(newScript, script);
                });
                
                while (temp.firstChild) {
                    banner.appendChild(temp.firstChild);
                }
            }
        }

        // INIT
        window.addEventListener('load', renderAd);
    