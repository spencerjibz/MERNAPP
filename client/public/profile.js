let myform
let but


let container
let changePhotobtn
let changephoto

function setup() {
    noCanvas()

    but = select('#but') || null
    if (but !==null) {
        but.mouseClicked(handle)
    }

    myform = select('#myform') || null;
    if (myform !== null) {
        myform.hide()
    }
    container = select('#forms')



    changePhotobtn = createButton('changePhoto').addClass('btn-default')
    container.child(changePhotobtn)
    changePhotobtn.mousePressed(handleChange)
    changephoto = select('#changeinfo').hide()


}

function handle() {
    myform.show()

    but.html('hide upload').mouseOver(() => {
        myform.hide()
    })
}

function handleChange() {
    if (but !== null && myform != null) {
        but.hide()
        myform.hide()
    } else {
        changephoto.show()
    }
}