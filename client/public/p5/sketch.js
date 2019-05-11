use:'strict'
var para;
var button;
var canv;
var inp;
var label;
var items;
var list;
var btn;
var comp;
var fileup;
var div;
var img;
var vid;
var cam;
var cap;
var li;
var get;
var file;
var tm;
var aud;
var slid;
var vol;
var hiddenbtn;
var selector;
var hiddeninp;

var container;
var clock
var filename;
// PROGRAM IS INTENDED TO ILLUSTRATE  THE ADVANCE USAGE OF THE P5JDOM LIBRARY
function setup() {
    // put setup code here
    canv = createCanvas(400, 400).position(700, 100)
    div = select('.container');
    div.child(canv);
    canv.hide();
    cam = select('#btn3').mouseClicked(webcam).position(400, 250)
    fileup = createFileInput(handleFile, 'multiple').hide()
    div.child(fileup);
    hiddenbtn = select('#buts').hide();
    para = select('#intro');
    para.position(100, 100);
    inp = select('#inp').position(100, 200)
    label = select('#labe').position(50, 200)
    button = select('#btn').position(100, 250)
    button.mousePressed(addme)
    list = select('#thelist');
    btn = select('#btn2').position(250, 250)
    btn.mouseClicked(some)
    inp.class('custom-file')
    slid = createSlider(0, 1, 0.1, 0);
    slid.position(100, 500)
    slid.style('width', '100px')
    slid.hide();
    container = div
    filename = createP('kk').hide().position(300, 150)

    container.child(vol)
    selector = select('#mysel').position(100, 100)

    selector.changed(action)
    hiddeninp = select('#inp_stuff').hide()
    clock = createElement('span', '<h1 id="time"><h1>')

    clock.position(500, 200).hide()

}

function draw() {

    if (img) {


        image(img, 0, 0, width, height);

    }





}





function addme() {

    if (!img && !vid && !cap) {
        if (inp.value().length > 0) {
            tm = inp.value();


            li = createElement('li', tm).class('list-group-item')
            list.class('list-group')
            comp = list.child(li);


        }
    }
}

function some() {
    if (!vid && !img && !cap) {
        if (comp.html().length > 0) {

            comp.html('')
        } else {
            comp.html('empty').class('alert-warning')
        }
    }
}

function handleFile(file) {

    print(file)
    filename.html(file.name).addClass('alert alert-warning').show()

    fileup.hide();
    switch (file.type) {
        // THIS HANDLES THE AUDIO FILE UPLOADED IN THE FRONTEND
        case 'image':
            img = createImg(file.data)
            img.hide();
            /////////////////
            hiddenbtn.show()

            canv.size(500, 500)
            para.html('Hey, you just uploaded an image, click the buttons below to show or hide the image');
            para.class(' alert-info');






            canv.position(900, 140)
            button.hide() && btn.hide()

            cam.value('Upload next').mouseClicked(function () {
                canv.hide();

                fileup.show();


            })

            break;
            // THIS HANDLES AND MANAGES THE UPLOADED VIDEO FILE 
        case 'video':
            vid = createVideo(file.data)
            vid.volume(0.1)
            vid.show();
            vid.showControls()
            canv.hide()


            ////////////////////////////////////////

            hiddenbtn.show()
            selector.show()
            para.html("You've successfully uploaded a video file, use the buttons below to pause or play the file");

            para.class('  alert-info')



            // image(vid,0,0,width, height); uncomment to render video to  the canvas,  controls won't be visible

            slid.changed(function (e) {
                vid.volume(e.target.value)
            })
            slid.show();

            vid.position(700, 170)
            button.hide()
            btn.hide()
            cam.value('Upload next').mousePressed(function () {
                vid.stop();
                vid.hide()
                fileup.show();

            })




            break;
            // THIS HANDLES THE AUDIO FILE UPLOADED AND  DEALS WITH IT 
        case "audio":
            aud = createAudio(file.data)


            aud.volume(0.1)
            aud.hide();
            aud.showControls()
            aud.loop(false)

            /// ///
            hiddenbtn.show()
            button.hide()
            btn.hide()
            aud.show()

            selector.position(100, 400).show()
            para.html('You managed to upload an audio, use the buttons below to play, pause and upload next,  plug in headphone or tune up the speaker', ).class('alert-info');
            inp.hide()
            label.hide()
            div.size(800, 800);
            aud.position(800, 170)
            slid.show()

            vol = slid.value();
            slid.changed(function (e) {
                aud.volume(e.target.value)
            })
            button.value('Show audio').mousePressed(function () {
                createP('VOLUME').position(100, 450).class('alert-danger')
                slid.show();
                aud.show()
                aud.play();

            })
            btn.value('hide').mouseClicked(function () {
                aud.hide()
            })
            cam.value('Upload and play next').mousePressed(function () {
                aud.stop()
                fileup.show();
                aud.hide()




            }).position(400, 250)









            break;
        default: // THIS HANDLES ANY UNSUPPORTED FILE TYPES
            para.html('THIS FILE TYPE IS NOT SUPPORTED,  TRY UPLOADING VIDEO,AUDIO AND IMAGES FILE').addClass('alert alert-warning')
            selector.show()
            fileup.show()
            break;

    }

}

function webcam() {
    if (!img && !vid && !aud) {
        // if there is no image neither video nor audio selected, create a video recording and do the following actions
        cap = createCapture(VIDEO).position(600, 170)
        container.child(cap)
        cap.hide()
        hiddenbtn.show()

        selector.show().position(100, 400)
        para.html('This function is supported by PCs with web cameras and particular browsers i.e the latest browser versions')
        inp.hide()
        label.hide()
        para.class(' text-warning');


        button.value('Show live-video').mouseClicked(function () {
            canv.hide()
            cap.show()


        })
        btn.value('hide recording').mouseClicked(function () {
            cap.hide()
        })
        cam.value('add filter').mouseClicked(function () {
            // create a selector with filter options (blur, normal and grayscale,sepia)
            let myopt = createSelect().position(500, 250)
            container.child(myopt)
            myopt.option('blur')
            myopt.option('grayscale')
            myopt.option('')
            myopt.option('invert')
            myopt.option('sepia')
            myopt.changed(handlefilter)

            function handlefilter(opt) {

                cap.hide()
                switch (myopt.value()) {
                    case 'blur':
                        cap.style('filter', 'blur(7px)')
                        cap.show()
                        break;
                    case 'grayscale':
                        cap.style('filter', 'grayscale(100%)')
                        cap.show()
                        break;
                    case 'invert':
                        cap.style('filter', 'invert(100%)')
                        cap.show()
                        break;
                    case 'sepia':
                        cap.style('filter', 'sepia(100%)')
                        cap.show()
                        break;
                    default:
                        cap.style('filter', 'none')
                        cap.show()
                        break;
                }
            }

        })

    }
}
//FUNCTION THAT HANDLES THE SELECT ATTRIBUTE ON THE FRONTEND 
function action() {
    switch (selector.value()) {
        case 'LIST EDITOR': // 
            selector.position(300, 400).show()
            hiddenbtn.show()
            hiddeninp.show();
            cam.hide();
            var constantLis = select('.res').show()
            constantLis.html('LIST')
            clock.hide()

            break;
        case 'MEDIA PLAYER':
            selector.show().position(200, 100)
            cam.show()
            hiddeninp.hide()
            clock.hide()
            fileup.show();
            break;
        case 'WEBCAM':
            selector.position(200, 300).show()
            hiddeninp.hide();
            hiddenbtn.show()
            select('.res').hide()
            clock.hide()
            break;
        case 'watch':
            selector.position(200, 100).show()
            hiddenbtn.hide()
            hiddeninp.hide();
            fileup.hide();


            clock.addClass('alert alert-success').show()




            var ti;
            var tr;
            setInterval(() => {
                ti = new Date()
                tr = ti.toLocaleTimeString()
                let tim = new timer(tr)


                tim.tell('#time')

            }, 1000)

            break;
        case 'DEFAULT':
            selector.position(200, 100).show()
            hiddenbtn.hide()
            hiddeninp.hide();
            fileup.hide();


    }

}




var timer = class Timer {

    constructor(time) {
        this.time = time
    }
    tell(id) {
        let changetime;


        let mi = select(id)
        changetime = mi.html(this.time);








    }

}