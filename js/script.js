class Slider {
    constructor(elementWrapper) {
        this.elements = [],
        this.buttonNumberActive = 0,
        this.activeElements = [],
        this.step = 0,
        this.shift = 0,
        this.speedShift = 9,
        this.partOfStep = 4,
        this.previousCoordinate = null,
        this.currentCoordinate = null,
        this.isMove = false,
        this.duration = 200,
        this.breakpoints = [399, 449, 768, 929, 1059, 1440, 1820],
        this.config = {
            elementWrapper: elementWrapper,
            classElement: 'slider-item',
            classButton: 'slider-button',
            activeClassElement: 'slider-item-active',
            activeClassButton: 'slider-button-active'
        }
    }

    getActiveButton(event) {
        this.buttonNumberActive = event.currentTarget.dataset.reSlideTo;
    }

    getActiveElements() {
        this.activeElements = [...document.querySelectorAll(`[data-re-slide-to="${this.buttonNumberActive}"]`)].filter((item) => item.dataset.reTarget === this.config.elementWrapper.id)
    }

    getclientX(event) {
        return event.targetTouches[0].clientX;
    }

    getStep() {
        if(window.innerWidth <= this.breakpoints[0]) {
            this.step = window.innerWidth - 12;
        } else if(window.innerWidth <= this.breakpoints[1]) {
            this.step = 380 + (window.innerWidth - 380) + 8;
        } else if(window.innerWidth < this.breakpoints[2]) {
            this.step = 310 + 0.1 * window.innerWidth;
        } else if(window.innerWidth < this.breakpoints[3]) {
            this.step = 310;
        } else if(window.innerWidth < this.breakpoints[4]) {
            this.step = 240;
        } else if(window.innerWidth <= this.breakpoints[5]) {
            this.step = 110 + 0.05 * window.innerWidth;
        } else if(window.innerWidth < this.breakpoints[6]) {
            this.step =  120 + 0.05 * window.innerWidth;
        } else {
            this.step = 0;
        }
    }

    getMaxNumberButton() {
        const elements = this.elements.map((item) => item.dataset.reSlideTo);

        return Math.max.apply(null, elements);
    }

    getElements() {
        this.elements = [...document.querySelectorAll('[data-re-slide-to]')].filter((item) => item.dataset.reTarget === this.config.elementWrapper.id)
    }

    removeActiveClass() {
        this.elements.forEach((item) => {
            if(item.classList.contains(this.config.activeClassElement)) {
                item.classList.remove(this.config.activeClassElement);
            };

            if(item.classList.contains(this.config.activeClassButton)) {
                item.classList.remove(this.config.activeClassButton);
            }
        });
    }

    addActiveClass() {
        this.activeElements.forEach((item) => {
            if(item.classList.contains(this.config.classElement)) {
                item.classList.add(this.config.activeClassElement);
            } else if(item.classList.contains(this.config.classButton)) {
                item.classList.add(this.config.activeClassButton);
            }
        });
    }

    move() {
        this.config.elementWrapper.animate(
            {left: `${-this.step*this.buttonNumberActive}px`},
            {duration: this.duration, fill: "both"}
        );
    }

    controlShifting() {
        if(this.previousCoordinate - this.currentCoordinate > 1) {
            this.previousCoordinate = this.currentCoordinate;
        };

        if(this.previousCoordinate - this.currentCoordinate >= 0 && this.shift < this.step * this.maxNumberButton) {
            this.shift += this.speedShift;

            if(this.shift > this.step * this.buttonNumberActive + this.step / this.partOfStep && this.buttonNumberActive < this.maxNumberButton) {
                this.buttonNumberActive++;
                this.isMove = true;
            }
        };

        if(this.previousCoordinate - this.currentCoordinate < 0 && this.shift > 0) {
            this.shift -= this.speedShift;

            if(this.shift < this.step * this.buttonNumberActive - this.step / this.partOfStep && this.buttonNumberActive > 0) {
                this.buttonNumberActive--;
                this.isMove = true;
            }
        };

        this.previousCoordinate = this.currentCoordinate;
    }

    init(event) {
        this.getElements();
        this.maxNumberButton = this.getMaxNumberButton();
        this.getActiveButton(event);
        this.getActiveElements();
        this.getStep();
        this.removeActiveClass();
        this.addActiveClass();
        this.move();
        this.shift = this.step*this.buttonNumberActive;
    }

    initTouch(event) {
        this.getElements();
        this.maxNumberButton = this.getMaxNumberButton();
        this.getStep();
        this.currentCoordinate = this.getclientX(event);
        this.controlShifting();
        this.config.elementWrapper.addEventListener('touchend', () => {
            if(this.isMove) {
                this.getActiveElements();
                this.removeActiveClass();
                this.addActiveClass();
                this.move();
                this.shift = this.step*this.buttonNumberActive;
                this.isMove = false;
            }
        })
    }
}

window.addEventListener('load', () => {
    const tariffsSliderCard = new Slider(document.querySelector('#tariffsSliderCard'));

    [...document.querySelectorAll('[data-re-target="tariffsSliderCard"]')].forEach((item) => {
        item.addEventListener('click', (e) => {
            tariffsSliderCard.init(e);
        });
    })

    document.querySelector('#tariffsSliderCard').addEventListener('touchmove', (e) => {
        tariffsSliderCard.initTouch(e);
    });
})
