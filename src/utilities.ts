let globalId = 0;

export function loadScript(url: string, callback: () => void, direct = false) {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    head.appendChild(script);
}
export function scriptLoader(paths: any[], cb: () => void) {
    loadScript('Scripts/jquery-2.1.0.min.js', () => {
        const pathKeeper = [];
        if (paths.length > 0) {
            const p = paths[0];
            paths.splice(0, 1);
            loadScript(p, () => { scriptLoader(paths, cb); });
        } else {
            cb();
        }
    }, true);
}

export function rand(min: number, max: number) {
    return Math.floor(Math.random() * max + 1) + (min - 1);
}

export function randFloat(min: number, max: number) {
    return (Math.random() * max + 1) + (min - 1);
}

export function getId() {
    return globalId++;
}

export function map(value: number, minValue: number, maxValue: number, min: number, max: number) {
    return (value - minValue) * (max - min) / (maxValue - minValue) + min;
}
