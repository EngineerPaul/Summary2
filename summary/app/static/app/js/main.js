'use strict';

const BIRTH_DATE = new Date(1996, 4, 18); // 18.05.1996, month 0-based

/** Возвращает возраст в годах от BIRTH_DATE до сегодня. */
function getAge() {
    const today = new Date();
    let age = today.getFullYear() - BIRTH_DATE.getFullYear();
    const month = today.getMonth() - BIRTH_DATE.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < BIRTH_DATE.getDate())) {
        age--;
    }
    return age;
}

/** Подставляет вычисленный возраст в заголовок (ФИО) и в блок «Личная информация». */
function initAge() {
    const age = getAge();
    const ageStr = age + ' ' + (age === 1 ? 'год' : age < 5 ? 'года' : 'лет');
    const inTitle = document.getElementById('age-in-title');
    const inPersonal = document.getElementById('age-in-personal');
    if (inTitle) inTitle.textContent = '(' + ageStr + ')';
    if (inPersonal) inPersonal.textContent = ageStr;
}

/** Управление модальным окном для просмотра изображений (открытие по клику, закрытие по оверлею/кнопке/Escape). */
const imageModal = {
    modal: null,
    modalImg: null,
    overlay: null,
    closeBtn: null,

    /** Показывает модалку с изображением по src и alt. */
    openModal(src, alt) {
        if (!this.modal || !this.modalImg) return;
        this.modalImg.src = src;
        this.modalImg.alt = alt || '';
        this.modal.classList.add('is-open');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    },

    /** Закрывает модалку и сбрасывает overflow у body. */
    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('is-open');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    },

    /** Вешает обработчики на картинки с data-zoom, оверлей, кнопку закрытия и Escape. */
    bind() {
        const self = this;
        document.querySelectorAll('.img-zoom[data-zoom]').forEach(function (img) {
            img.addEventListener('click', function () {
                self.openModal(this.src, this.alt);
            });
        });
        if (this.overlay) this.overlay.addEventListener('click', function () { self.closeModal(); });
        if (this.closeBtn) this.closeBtn.addEventListener('click', function () { self.closeModal(); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && self.modal && self.modal.classList.contains('is-open')) {
                self.closeModal();
            }
        });
    },

    /** Находит элементы модалки и вызывает bind(). */
    init() {
        this.modal = document.getElementById('img-modal');
        this.modalImg = document.getElementById('modal-img');
        this.overlay = this.modal && this.modal.querySelector('.modal-overlay');
        this.closeBtn = this.modal && this.modal.querySelector('.modal-close');
        this.bind();
    }
};

/** Управление каруселями на странице: переключение слайдов, точки, prev/next. */
const carousels = {
    /** Показывает слайд с индексом index (с зацикливанием), обновляет active у картинок и точек. */
    showSlide(instance, index) {
        if (index < 0) index = instance.images.length - 1;
        if (index >= instance.images.length) index = 0;
        instance.current = index;
        instance.images.forEach(function (img, i) {
            img.classList.toggle('active', i === instance.current);
        });
        if (instance.dotsEl) {
            const dots = instance.dotsEl.querySelectorAll('.carousel-dot');
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === instance.current);
            });
        }
    },

    /** Создаёт точки для нескольких слайдов и вешает на них клики. */
    createDots(instance) {
        if (instance.images.length <= 1 || !instance.dotsEl) return;
        const self = this;
        for (let i = 0; i < instance.images.length; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
            (function (idx) {
                dot.addEventListener('click', function () { self.showSlide(instance, idx); });
            })(i);
            instance.dotsEl.appendChild(dot);
        }
    },

    /** Инициализирует одну карусель: создаёт точки, вешает prev/next, показывает первый слайд. */
    setupOne(carouselEl) {
        const inner = carouselEl.querySelector('.carousel-inner');
        const images = inner ? inner.querySelectorAll('.carousel-img') : [];
        const prevBtn = carouselEl.querySelector('.carousel-prev');
        const nextBtn = carouselEl.querySelector('.carousel-next');
        const dotsEl = carouselEl.querySelector('.carousel-dots');
        if (images.length === 0) return;

        const instance = { current: 0, images: images, dotsEl: dotsEl };
        const self = this;

        this.createDots(instance);
        if (prevBtn) prevBtn.addEventListener('click', function () { self.showSlide(instance, instance.current - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { self.showSlide(instance, instance.current + 1); });
        this.showSlide(instance, 0);
    },

    /** Находит все [data-carousel] и для каждой вызывает setupOne. */
    init() {
        document.querySelectorAll('[data-carousel]').forEach(this.setupOne.bind(this));
    }
};

/** Точка входа: возраст, модалка, карусели. */
function main() {
    initAge();
    imageModal.init();
    carousels.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
