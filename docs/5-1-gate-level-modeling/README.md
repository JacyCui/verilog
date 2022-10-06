# Verilog 门级建模

大多数数字设计都是在 RTL 等更高的抽象层次上完成的，尽管有时通过使用 and 和 or 等​​组合元素在较低层次上构建更小的确定性电路变得很直观。在此级别完成的建模通常称为门级建模，因为它涉及门并且在硬件原理图和 Verilog 代码之间具有一对一的关系。

Verilog 支持一些称为原语(primitive)的基本逻辑门，因为它们可以像模块一样被实例化，因为它们已经被预定义。

## And/Or/Xor 门

这些原语实现了一个 AND 和一个 OR 门，它们接受许多标量输入并提供单个标量输出。这些原语的参数列表中的第一个端口是输出，只要任何输入发生变化，它就会更新。

```verilog
module gates (	input a, b,
				output c, d, e);

	and (c, a, b); 	// c is the output, a and b are inputs
	or  (d, a, b);	// d is the output, a and b are inputs
	xor (e, a, b); 	// e is the output, a and b are inputs
endmodule
```

```verilog
module tb;
	reg a, b;
	wire c, d, e;
	integer i;

	gates u0 ( .a(a), .b(b), .c(c), .d(d), .e(e));

	initial begin
		{a, b} = 0;

        $monitor ("[T=%0t a=%0b b=%0b c(and)=%0b d(or)=%0b e(xor)=%0b", $time, a, b, c, d, e);

		for (i = 0; i < 10; i = i+1) begin
			#1 	a <= $random;
				b <= $random;
		end
	end
endmodule
```

仿真日志：

```bash
[T=0 a=0 b=0 c(and)=0 d(or)=0 e(xor)=0
[T=1 a=0 b=1 c(and)=0 d(or)=1 e(xor)=1
[T=2 a=1 b=1 c(and)=1 d(or)=1 e(xor)=0
[T=4 a=1 b=0 c(and)=0 d(or)=1 e(xor)=1
[T=5 a=1 b=1 c(and)=1 d(or)=1 e(xor)=0
[T=6 a=0 b=1 c(and)=0 d(or)=1 e(xor)=1
[T=7 a=1 b=0 c(and)=0 d(or)=1 e(xor)=1
[T=10 a=1 b=1 c(and)=1 d(or)=1 e(xor)=0
```

## Nand/Nor/Xnor 门

上述所有门的逆为 `nand` 、 `nor` 和 `xnor` 。重复使用上面的相同设计，不同之处在于原语使用它们的反向版本进行替换。

```verilog
module gates (	input a, b,
				output c, d, e);

	// Use nand, nor, xnor instead of and, or and xor
	// in this example
	nand (c, a, b); 	// c is the output, a and b are inputs
	nor  (d, a, b);		// d is the output, a and b are inputs
	xnor (e, a, b); 	// e is the output, a and b are inputs
endmodule
```

```verilog
module tb;
	reg a, b;
	wire c, d, e;
	integer i;

	gates u0 ( .a(a), .b(b), .c(c), .d(d), .e(e));

	initial begin
		{a, b} = 0;

        $monitor ("[T=%0t a=%0b b=%0b c(nand)=%0b d(nor)=%0b e(xnor)=%0b", $time, a, b, c, d, e);

		for (i = 0; i < 10; i = i+1) begin
			#1 	a <= $random;
				b <= $random;
		end
	end
endmodule
```

仿真日志：

```bash
[T=0 a=0 b=0 c(nand)=1 d(nor)=1 e(xnor)=1
[T=1 a=0 b=1 c(nand)=1 d(nor)=0 e(xnor)=0
[T=2 a=1 b=1 c(nand)=0 d(nor)=0 e(xnor)=1
[T=4 a=1 b=0 c(nand)=1 d(nor)=0 e(xnor)=0
[T=5 a=1 b=1 c(nand)=0 d(nor)=0 e(xnor)=1
[T=6 a=0 b=1 c(nand)=1 d(nor)=0 e(xnor)=0
[T=7 a=1 b=0 c(nand)=1 d(nor)=0 e(xnor)=0
[T=10 a=1 b=1 c(nand)=0 d(nor)=0 e(xnor)=1
```

这些门可以有两个以上的输入。

```verilog
module gates (	input a, b, c, d,
				output x, y, z);

    and (x, a, b, c, d); 	// x is the output, a, b, c, d are inputs
    or  (y, a, b, c, d);	// y is the output, a, b, c, d are inputs
    nor (z, a, b, c, d); 	// z is the output, a, b, c, d are inputs
endmodule
```

```verilog
module tb;
	reg a, b, c, d;
	wire x, y, z;
	integer i;

    gates u0 ( .a(a), .b(b), .c(c), .d(d), .x(x), .y(y), .z(z));

	initial begin
        {a, b, c, d} = 0;

        $monitor ("[T=%0t a=%0b b=%0b c=%0b d=%0b x=%0b y=%0b x=%0b", $time, a, b, c, d, x, y, z);

		for (i = 0; i < 10; i = i+1) begin
			#1 	a <= $random;
				b <= $random;
          		c <= $random;
          		d <= $random;
		end
	end
endmodule
```

仿真日志：

```bash
[T=0 a=0 b=0 c=0 d=0 x=0 y=0 x=1
[T=1 a=0 b=1 c=1 d=1 x=0 y=1 x=0
[T=2 a=1 b=1 c=1 d=0 x=0 y=1 x=0
[T=3 a=1 b=1 c=0 d=1 x=0 y=1 x=0
[T=4 a=1 b=0 c=1 d=0 x=0 y=1 x=0
[T=5 a=1 b=0 c=1 d=1 x=0 y=1 x=0
[T=6 a=0 b=1 c=0 d=0 x=0 y=1 x=0
[T=7 a=0 b=1 c=0 d=1 x=0 y=1 x=0
[T=8 a=1 b=1 c=1 d=0 x=0 y=1 x=0
[T=9 a=0 b=0 c=0 d=1 x=0 y=1 x=0
[T=10 a=0 b=1 c=1 d=1 x=0 y=1 x=0
```

## Buf/Not 门

这些门只有一个标量输入和一个或多个输出。 `buf` 代表缓冲区，只需将值从输入传输到输出，而不会改变极性。 `not` 代表在其输入端反转信号极性的逆变器。因此，其输入处的 0 将产生 1，反之亦然。

```verilog
module gates (	input a,
				output c, d);

    buf (c, a); 		// c is the output, a is input
    not (d, a);         // d is the output, a is input
endmodule
```

```verilog
module tb;
	reg a;
	wire c, d;
	integer i;

	gates u0 ( .a(a), .c(c), .d(d));

	initial begin
		a = 0;

        $monitor ("[T=%0t a=%0b c(buf)=%0b d(not)=%0b", $time, a, c, d);

		for (i = 0; i < 10; i = i+1) begin
			#1 	a <= $random;
		end
	end
endmodule
```

仿真日志：

```bash
[T=0 a=0 c(buf)=0 d(not)=1
[T=2 a=1 c(buf)=1 d(not)=0
[T=8 a=0 c(buf)=0 d(not)=1
[T=9 a=1 c(buf)=1 d(not)=0
```

端口列表中的最后一个端口连接到门的输入，所有其他终端连接到门的输出端口。这是一个多输出缓冲区的示例，尽管它很少使用。

```verilog
module gates (	input  a,
				output c, d);

    not (c, d, a); 		// c,d is the output, a is input

endmodule
```

仿真日志：

```bash
[T=0 a=0 c=1 d=1
[T=2 a=1 c=0 d=0
[T=8 a=0 c=1 d=1
[T=9 a=1 c=0 d=0
```

## Bufif/Notif

通过 `bufif` 和 `notif` 原语可以使用带有附加控制信号以启用输出的缓冲器和反相器。这些门只有在启用控制信号时才具有有效输出，否则输出将处于高阻抗状态。有两种版本，一种是正常极性的控制，用 1 表示，如 `bufif1` 和 `notif1` ，第二种是反极性的控制，用 0 表示，如 `bufif0` 和 `notif0` 。


