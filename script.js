'use strict';
(()=>{
const JSON_DATA = {
    toasterAnimation: {}
}
const textEl = document.getElementById('tutorial_text');
async function loadJSONinRepl(){
  JSON_DATA.toasterAnimation = __toaster_animation_data__;
}
const toasterApp =  () => {
  textEl.innerHTML='lower the lever<br/> to toast'
  const methodsLibrary = {
    animation_interactions: {
      restart: function () {
        this.animList.value[0].destroy();
        this.animList.value[0] = lottie.loadAnimation(this.lottieParams.value);
        this.animList.value[0].playSegments([0, 300], true); //the problem is here
        this.coordsY.set(0);
        this.dir.set(1);
        this.cacheMouseY.set([0, 0])
        this.isBaking.set(false);
        this.animList.value[0].loop = true;
        const self = this;
        this.animList.value[0].addEventListener('DOMLoaded', function () {
          self.toastStart(self.lottieParams.value.container.children[0].children[1].children[5],
            {
              segment: [300, 550],
              endTime: 249,
              ToastCoordsInd: 0,
              nextComp: self.lottieParams.value.container.children[0].children[1].children
            });
        });
      },
      dragLever: function (lever, toast, onEnd) {
        const self = this;
        const toastCoords = self.toastCoords.get()[onEnd.ToastCoordsInd];
        const eventType = self.eventType.get();
      
        lever.addEventListener(eventType, function (e) {
          textEl.style.visibility = 'hidden';
          const cacheMouseY = self.cacheMouseY;
          let coordsY = self.coordsY;
          let dir = self.dir;
          const dragSteps = self.dragSteps.get();
          cacheMouseY.value.push(e.clientY)
          cacheMouseY.value.shift();

          if(eventType==='click' && !window.myInterval){

            window.myInterval =  setInterval(()=>{
            coordsY.value+=1;
            coordsY.set(coordsY.value + dragSteps * dir.value);
            const newY = coordsY.get();
            toast.setAttribute('transform', `matrix(${toastCoords[0]},${newY + toastCoords[1]})`)
            this.setAttribute('transform', `matrix(1.1908400058746338,0,0,1.553570032119751,337.59454345703125,${newY + 134.37042236328125})`)
            
             
             if (coordsY.value >= 95) {
               if(window.myInterval != undefined && window.myInterval != 'undefined'){
             window.clearInterval(window.myInterval);
                window.myInterval = undefined;
              }
           
              coordsY.set(94);
               if (onEnd && !Animation.isBaking.value) {
                Animation.isBaking.set(true);
                self.animList.value[0].loop = false;
                
                self.animList.value[0].playSegments(onEnd.segment, true); 
                self.animList.value[0].addEventListener('enterFrame',  (e) => {
                  if (onEnd.endTime === 'restart') {
                    onEnd.endTime = 'start';
                    setTimeout(() => {
                      Animation.restart();
                    }, 9000);

                  }
                  if (e.currentTime === onEnd.endTime) {
                    const comp = onEnd.nextComp;
                    const lever = comp[4].children[1];
                    const toast = comp[3];
                    coordsY.set(0);
                    dir.set(1);
                    cacheMouseY.set([0, 0])
                    const onEndParams = {
                      segment: [600, 950],
                      endTime: 'restart',
                      ToastCoordsInd: 1,
                    }
                    Animation.isBaking.set(false);
                    textEl.style.visibility = "visible";
                    textEl.innerHTML = 'That was fun!<br/> Do it again!';
                    self.dragLever(lever, toast, onEndParams)

                  }

                })
              }
           
             }
            },50);
          
          }


          if (coordsY.value < 95 && coordsY.value >= 0) {
            if (cacheMouseY.value[0] >= cacheMouseY.value[1]) dir.set(-1);
            else dir.set(1);
            coordsY.set(coordsY.value + dragSteps * dir.value);
            const newY = coordsY.get();
            toast.setAttribute('transform', `matrix(${toastCoords[0]},${newY + toastCoords[1]})`)
            this.setAttribute('transform', `matrix(1.1908400058746338,0,0,1.553570032119751,337.59454345703125,${newY + 134.37042236328125})`)
          } else {
            if (coordsY.value >= 95) {
              coordsY.set(94);
              if (onEnd && !Animation.isBaking.value) {
                Animation.isBaking.set(true);
                self.animList.value[0].loop = false;
                self.animList.value[0].playSegments(onEnd.segment, true);
          
                self.animList.value[0].addEventListener('enterFrame',  (e)=> {
                  if (onEnd.endTime === 'restart') {
                    onEnd.endTime = 'start';
                    setTimeout(() => {
                      Animation.restart();
                    }, 9000);
                  
                  }
                  if (e.currentTime === onEnd.endTime) {
                    const comp = onEnd.nextComp;
                    const lever = comp[4].children[1];
                    const toast = comp[3];
                    coordsY.set(0);
                    dir.set(1);
                    cacheMouseY.set([0, 0])
                    const onEndParams = {
                      segment: [600, 950],
                      endTime: 'restart',
                      ToastCoordsInd: 1,
                    }
                    Animation.isBaking.set(false);
                    textEl.style.visibility = "visible";
                    textEl.innerHTML = 'That was fun!<br/> Do it again!';
                    self.dragLever(lever, toast, onEndParams)
                 
                  }

                })
              }
            } else {
              coordsY.set(1);
            }
          }
        })
      },
      toastStart: function (currentComposition, onEnd) {
        const comp = currentComposition;
        const toast = comp.children[0];
        const lever = comp.children[2];
        this.dragLever(lever, toast, onEnd);
      },
    }
  };

  const Entity =  (data, ...methodList) => {
    const methods = methodsLibrary.animation_interactions;
    const obj = {};
     const checkType = (val) =>{
      let type = typeof val;
      if (Array.isArray(val)) { type = "array" };
      return type;
    }
    for (const prop in data) {
      obj[prop] = { value: data[prop], type: checkType(data[prop]) };
      obj[prop].set = (val) => {
        try {
          if (checkType(val) === obj[prop].type) { obj[prop].value = val }
          else {
            throw 'Parameter is not of type ' + obj[prop].type;
          }
        } catch (err) { console.error(err) }
      };
      obj[prop].get = () => { return obj[prop].value };
      obj[prop].cast = (val) => { obj[prop].value = val; obj[prop].type = checkType(val) };
    }
    for (const method of methodList) { obj[method] = methods[method] }
    return Object.freeze(obj);
  }

 const isTouchDeviceSettings = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) ? 'click' : 'mousemove';
  
  const Animation = Entity(
    {
      animList: [],
      lottieParams: {
        container: document.getElementById('toasterLottie'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: JSON_DATA.toasterAnimation
      },
      eventType: isTouchDeviceSettings,
      isBaking:false,
      dragSteps:4,
      coordsY: 0,
      cacheMouseY: [0, 0],
      dir: 1,
      toastCoords: [['0.9999959468841553,0,0,1.0000019073486328,204.5012969970703', 198.7488250732422], ['1,0,0,1,0', 0]]
    }
    , 'toastStart', 'dragLever', 'restart');

  Animation.animList.value[0] = lottie.loadAnimation(Animation.lottieParams.value);

  Animation.animList.value[0].playSegments([0, 300], true);
  Animation.animList.value[0].addEventListener('DOMLoaded',  ()=> {
    Animation.toastStart(Animation.lottieParams.value.container.children[0].children[1].children[5],
      {
        segment: [300, 550],
        endTime: 249,
        ToastCoordsInd: 0,
        nextComp: Animation.lottieParams.value.container.children[0].children[1].children
      });
  });

};


(async function buildApp(){
  await loadJSONinRepl();
  await toasterApp();
}());

})();