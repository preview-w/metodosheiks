// Funcionalidades essenciais da página

// Lazy Loading de imagens
(function() {
    /*! Lazy Load 2.0.0-rc.2 - MIT license - Copyright 2007-2019 Mika Tuupola */
    function LazyLoad(images, options) {
        this.settings = Object.assign({
            src: "data-src",
            srcset: "data-srcset",
            selector: ".lazyload",
            root: null,
            rootMargin: "0px",
            threshold: 0
        }, options || {});
        
        this.images = images || document.querySelectorAll(this.settings.selector);
        this.observer = null;
        this.init();
    }

    LazyLoad.prototype = {
        init: function() {
            if (!window.IntersectionObserver) {
                this.loadImages();
                return;
            }

            let self = this;
            let config = {
                root: this.settings.root,
                rootMargin: this.settings.rootMargin,
                threshold: [this.settings.threshold]
            };

            this.observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        self.observer.unobserve(entry.target);
                        let src = entry.target.getAttribute(self.settings.src);
                        let srcset = entry.target.getAttribute(self.settings.srcset);
                        
                        if (entry.target.tagName.toLowerCase() === "img") {
                            if (src) entry.target.src = src;
                            if (srcset) entry.target.srcset = srcset;
                        } else {
                            entry.target.style.backgroundImage = "url(" + src + ")";
                        }
                    }
                });
            }, config);

            this.images.forEach(function(image) {
                self.observer.observe(image);
            });
        },

        loadImages: function() {
            if (!this.settings) return;
            
            let self = this;
            this.images.forEach(function(image) {
                let src = image.getAttribute(self.settings.src);
                let srcset = image.getAttribute(self.settings.srcset);
                
                if (image.tagName.toLowerCase() === "img") {
                    if (src) image.src = src;
                    if (srcset) image.srcset = srcset;
                } else {
                    image.style.backgroundImage = "url('" + src + "')";
                }
            });
        },

        destroy: function() {
            if (this.settings) {
                this.observer.disconnect();
                this.settings = null;
            }
        }
    };

    // Inicializar lazy loading quando a página carregar
    window.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length) {
            new LazyLoad(images);
        }
    });

    // Disponibilizar globalmente se necessário
    window.LazyLoad = LazyLoad;
})();

// Funcionalidade de carregamento da página
(function() {
    let timeout;
    
    // Disparar evento de página carregada
    window.dispatchEvent(new Event("pageLoaded"));
    
    // Função para disparar lazy load
    const triggerLazyLoad = function() {
        clearTimeout(timeout);
        
        // Remover listeners
        window.removeEventListener("mousemove", triggerLazyLoad);
        window.removeEventListener("keydown", triggerLazyLoad);
        window.removeEventListener("touchstart", triggerLazyLoad);
        window.removeEventListener("click", triggerLazyLoad);
        
        // Disparar evento de lazy load
        window.dispatchEvent(new Event("pageLazyLoad"));
    };
    
    // Adicionar listeners para interação do usuário
    window.addEventListener("mousemove", triggerLazyLoad);
    window.addEventListener("keydown", triggerLazyLoad);
    window.addEventListener("touchstart", triggerLazyLoad);
    window.addEventListener("click", triggerLazyLoad);
    
    // Timeout de fallback (3 segundos)
    timeout = setTimeout(triggerLazyLoad, 3000);
})();

// Funcionalidade para substituir parâmetros de query string (se necessário)
(function() {
    function replaceQueryStringParam(queryStringValues, element) {
        let outerHTML = element.outerHTML;

        queryStringValues.forEach((item) => {
            let param = "{:" + item.key + "}";
            if (outerHTML.includes(param)) {
                let regExp = new RegExp(param, "g");
                outerHTML = outerHTML.replace(regExp, item.value);
            }
        });

        if (outerHTML !== element.outerHTML) {
            element.outerHTML = outerHTML;
        }
    }

    // Processar query strings quando a página carregar
    window.addEventListener('DOMContentLoaded', function() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const queryStringElements = document.body.querySelectorAll("*");
        const queryStringValues = [];

        urlSearchParams.forEach(function(value, key) {
            queryStringValues.push({ key, value });
        });

        queryStringElements.forEach(function(element) {
            replaceQueryStringParam(queryStringValues, element);
        });
    });
})();

// Melhorias de UX e animações
(function() {
    // Adicionar classe para elementos que entraram na viewport
    const observeElements = function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observar elementos principais
        const elementsToObserve = document.querySelectorAll('.card, .testimonial, .cta');
        elementsToObserve.forEach(el => observer.observe(el));
    };

    // Smooth scroll para links internos
    const setupSmoothScroll = function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Inicializar quando o DOM estiver pronto
    window.addEventListener('DOMContentLoaded', function() {
        observeElements();
        setupSmoothScroll();
    });
})();

// Console log para debug (remover em produção se necessário)
console.log('Página carregada com sucesso - Versão limpa sem tracking');