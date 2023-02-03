const setValue = (t) => {
    if (Number(t.value) < Number(t.min)) {
        t.value = t.min;
        return;
    }

    if (Number(t.value) > Number(t.max)) {
        t.value = t.max;
        return;
    }
}