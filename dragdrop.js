const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".drag-container");

var initialX;
var initialY;

var clientX;
var clientY;

var draggingHeight;

var xOffset;
var yOffset;

const removeTransitions = () => {
    // Entferne die Klasse .transition in allen Draggable-Elementen
    document.querySelectorAll(".draggable").forEach((d) => {
        d.classList.remove("transition");
    });
};

const handleDragStart = (e, container, isTouch) => {
    container.style.setProperty(
        "--drag-container-scroll-width",
        `${container.scrollWidth}px`
    );

    // Entferne alle Übergänge, um sicherzustellen, dass keine seltsamen Probleme auftreten
    removeTransitions();

    const draggable = e.target;

    // Drag-and-Drop funktioniert nicht, wenn es weniger als 2 Elemente im Container gibt
    if (container.children.length < 2) {
        return;
    }

    // Abbrechen, wenn das Ziel-Element kein Draggable-Element ist
    if (!draggable.classList.contains("draggable")) {
        return;
    }

    // Bestimme die Koordinaten des Mausklicks (bzw. des Touchs auf Touch-Geräten)
    clientX = isTouch ? e.touches[0].clientX : e.clientX;
    clientY = isTouch ? e.touches[0].clientY : e.clientY;

    // Initiale X- und Y-Koordinaten des Elements, das gerade gedragged wird
    initialX = draggable.getBoundingClientRect().x;
    initialY = draggable.getBoundingClientRect().y;

    // Berechne den Offset zwischen der aktuellen X- und Y-Koordinate des Klicks und der
    // ursprünglichen X- und Y-Koordinate des Elements, das gerade gedragged wird
    xOffset = clientX - initialX;
    yOffset = clientY - initialY;
    // console.log(initialX);
    // console.log(initialY);

    // Bestimme das nächste oder vorherige Element des Elements, das gerade gedragged wird
    let sibling =
        draggable.nextElementSibling ?? draggable.previousElementSibling;

    // Bestimme die Höhe des Dragging-Elements, indem man die Höhe des nächsten oder vorherigen Elements
    // minus die Höhe des gerade gedragged werdenden Elements berechnet
    draggingHeight =
        sibling.getBoundingClientRect().y - draggable.getBoundingClientRect().y;

    // Stelle sicher, dass die Höhe einen positiven Wert hat
    if (draggingHeight < 0) {
        draggingHeight = draggingHeight * -1;
    }

    // console.log("Drag start.");
    draggable.parentElement.classList.add("dragging-container");
    draggable.classList.add("dragging");
    draggable.style.transform = `translate(${initialX}px, ${initialY}px)`;

    const draggableElements = [
        ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    // console.log(draggableElements);

    // Überprüfe jedes Element im Array und übertrage die Höhe des gedraggten Elements,
    // um position: absolute (in .dragging festgelegt) auszugleichen.
    draggableElements.map((el) => {
        // console.log(el);
        if (el.dataset.index > draggable.dataset.index) {
            el.style.transform = `translate(0, ${draggingHeight}px)`;
        }
    });

    // draggable.classList.add("dragging");
};

const handleDrag = (e, container, isTouch) => {
    e.preventDefault();

    const dragging = container.querySelector(".dragging");
    // console.log(e);

    // Abbrechen, wenn kein Element gedraggt wird (notwendig, weil der Event-Listener mousemove verwendet wird).
    if (!dragging) {
        return;
    }

    // console.log("Continuing to drag...");

    // Feststellen, wo sich die Maus/der Finger (bei Touch-Geräten) befindet
    clientX = isTouch ? e.touches[0].clientX : e.clientX;
    clientY = isTouch ? e.touches[0].clientY : e.clientY;

    // Setzen von currentX und currentY als Abstand vom Anfangspunkt
    currentX = clientX - xOffset;
    currentY = clientY - yOffset;

    // Überprüfen, ob das Element nach unten oder oben bewegt wird (verglichen mit der Ausgangsposition des Elements)
    const isMoveDown = currentY - initialY > 0;

    // Setzen von Translate-Transform, um das Element zu bewegen
    dragging.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // Das nächstgelegene Element überprüfen und ggf. die Position anpassen.
    getDragAfterElement(
        dragging,
        isTouch ? e.touches[0].clientY : e.clientY,
        isMoveDown,
        false
    );
};

const handleDrop = (e, container, isTouch) => {
    // Entferne alle Übergänge, um sicherzustellen, dass keine seltsamen Probleme auftreten
    removeTransitions();

    const dragging = container.querySelector(".dragging");

    // Abbrechen, wenn kein Element gedraggt wird.
    if (!dragging) {
        return;
    }

    // console.log("Drag end.");
    // let clientY = isTouch ? e.touches[0].clientY : e.clientY

    // Überprüfen, ob das Element nach unten bewegt wurde
    const isMoveDown = clientY - initialY > 0;

    // Bestimmen des nachfolgenden Elements, vor das das gezogene Element eingefügt werden soll
    let el = getDragAfterElement(dragging, clientY, isMoveDown, true);

    // dragging.classList.add("transition");

    // TODO: Make the transition work. Before inserting the element,
    // TODO: move it to the right position, then insert it.
    // let currentY = el.getBoundingClientRect().y - initialY;
    // dragging.style.transform = `translate(0px, ${currentY}px)`;

    if (!!el) {
        dragging.parentElement.insertBefore(dragging, el);
    } else if (isMoveDown) {
        // Wenn das Element nach unten bewegt wurde und es kein nachfolgendes Element gibt, wird es ans Ende der Liste angehängt
        dragging.parentElement.appendChild(dragging);
    }

    dragging.parentElement.classList.remove("dragging-container");
    dragging.classList.remove("dragging");

    dragging.removeAttribute("style");

    // Aktualisieren des Index-Datasets aller Elemente
    const draggableElements = [...document.querySelectorAll(".draggable")];
    for (let i = 0; i < draggableElements.length; i++) {
        const element = draggableElements[i];
        element.dataset.index = i + 1;
    }
};

function getDragAfterElement(dragging, y, isMoveDown, isDragEnd) {
    // Gibt das Element nach dem gedraggten Element zurück und verschiebt die Elemente entsprechend der Position des gedraggten Elements

    // console.log(`Is move down: ${isMoveDown}`);
    const index = dragging.dataset.index;

    const draggableElements = [
        ...document.querySelectorAll(".draggable:not(.dragging)"),
    ];

    const moveDownCallback = (closest, child) => {
        const box = child.getBoundingClientRect();

        // Abstand zwischen Y-Position der Maus und der Mitte des überprüften child-Elements
        // Positiver Offset: Das gedraggte Element befindet sich unter/nach dem überprüften child-Element
        // Negativer Offset: Das gedraggte Element befindet sich über/vor dem überprüften child-Element
        const offset = y - box.top - box.height / 2;

        // Ignoriere Elemente, die entsprechend ihrem Index definitiv über dem gedraggten Element liegen
        // und so bei einer Abwärtsverschiebung keine Rolle spielen. Auch wenn sich das child-Element
        // oberhalb des gedraggten Elements befindet, soll es an seine Ausgangsposition zurückgehen.
        if (child.dataset.index < index || offset >= 0) {
            child.removeAttribute("style");

            return closest;
        }

        // Ansonsten wird das child-Element um die Höhe des gedraggten Elements nach unten verschoben.
        child.style.transform = `translate(0, ${draggingHeight}px)`;

        // Wenn das aktuelle child-Element näher unterhalb des gedraggten Elements ist als das bisher in closest
        // gespeicherte, wird das closest-Objekt mit dem child-Element und dem aktuellen Offset aktualisiert
        if (offset > closest.offset && offset <= 0) {
            return { offset: offset, element: child };
        }

        return closest;
    };

    const moveUpCallback = (closest, child) => {
        const box = child.getBoundingClientRect();

        // Abstand zwischen Y-Position der Maus und der Mitte des überprüften child-Elements
        // Positiver Offset: Das gedraggte Element befindet sich unter/nach dem überprüften child-Element
        // Negativer Offset: Das gedraggte Element befindet sich über/vor dem überprüften child-Element
        const offset = y - box.top - box.height / 2;

        // Wenn sich das child-Element oberhalb des gedraggten Elements befindet, soll es an seine Ausgangsposition zurückgehen.
        if (offset >= 0) {
            child.removeAttribute("style");

            return closest;
        }

        // Ansonsten wird es um die Höhe des gedraggten Elements nach unten verschoben.
        child.style.transform = `translate(0, ${draggingHeight}px)`;

        // Ignoriere Elemente, die entsprechend ihrem Index definitiv unter dem gedraggten Element liegen und so bei einer Aufwärtsverschiebung keine Rolle spielen.
        if (child.dataset.index > index) {
            return closest;
        }

        // Wenn das aktuelle child-Element näher unterhalb des gedraggten Elements ist als das bisher in closest
        // gespeicherte, wird das closest-Objekt mit dem child-Element und dem aktuellen Offset aktualisiert
        if (offset > closest.offset && offset <= 0) {
            return { offset: offset, element: child };
        }

        return closest;
    };

    return draggableElements.reduce(
        (a, b) => {
            if (!isDragEnd) {
                b.classList.add("transition");
            }

            callback = isMoveDown ? moveDownCallback : moveUpCallback;
            let returnValue = callback(a, b);

            if (isDragEnd) {
                b.removeAttribute("style");
            }

            return returnValue;
        },
        {
            offset: Number.NEGATIVE_INFINITY,
        }
    ).element;
}

// Event-Listener hinzufügen, damit Drag-and-Drop auch funktioniert.
containers.forEach((container) => {
    // Event-Listener für dragstart
    container.addEventListener(
        "mousedown",
        (e) => {
            handleDragStart(e, container);
        },
        false
    );
    container.addEventListener("touchstart", (e) => {
        handleDragStart(e, container, true);
    });

    // Event-Listener für dragmove
    container.addEventListener(
        "mousemove",
        (e) => {
            handleDrag(e, container);
        },
        false
    );
    container.addEventListener(
        "touchmove",
        (e) => {
            handleDrag(e, container, true);
        },
        false
    );

    // Event-Listener für drop
    container.addEventListener(
        "mouseup",
        (e) => {
            handleDrop(e, container);
        },
        false
    );
    container.addEventListener(
        "touchend",
        (e) => {
            handleDrop(e, container, true);
        },
        false
    );
});

draggables.forEach((draggable) => {
    draggable.addEventListener("transitionend", () => {
        console.log("Transition end");
        draggable.classList.remove("transition");
    });
});
