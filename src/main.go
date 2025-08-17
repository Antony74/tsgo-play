package main

import (
	"syscall/js"
)

func add(this js.Value, args []js.Value) any {
	if len(args) < 2 {
		return 0
	}
	return args[0].Int() + args[1].Int()
}

func hello(this js.Value, args []js.Value) any {
	name := "world"
	if len(args) > 0 {
		name = args[0].String()
	}
	return "hi, " + name
}

func main() {
	// Expose to JS globalThis
	js.Global().Set("add", js.FuncOf(add))
	js.Global().Set("hello", js.FuncOf(hello))

	// Keep the Go runtime alive so Node can call your funcs
	select {}
}
