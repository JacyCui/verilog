# Verilog 开关级建模

Verilog 还提供对晶体管级建模的支持，尽管如今设计人员很少使用它，因为电路的复杂性要求他们转向更高级别的抽象，而不是使用开关级建模。

## NMOS/PMOS

```verilog
module des (input d, ctrl,
			output outn, outp);
    nmos (outn, d, ctrl);
    pmos (outp, d, ctrl);
endmodule
```

```verilog
module tb;
    reg d, ctrl;
    wire outn, outp;

    des u0 (.d(d), .ctrl(ctrl), .outn(outn), .outp(outp));

    initial begin
        {d, ctrl} <= 0;

        $monitor ("T=%0t d=%0b ctrl=%0b outn=%0b outp=%0b", $time, d, ctrl, outn, outp);

        #10 d <= 1;
        #10 ctrl <= 1;
        #10 ctrl <= 0;
        #10 d <= 0;
    end
endmodule
```

仿真日志：

```bash
T=0 d=0 ctrl=0 outn=z outp=0
T=10 d=1 ctrl=0 outn=z outp=1
T=20 d=1 ctrl=1 outn=1 outp=z
T=30 d=1 ctrl=0 outn=z outp=1
T=40 d=0 ctrl=0 outn=z outp=0
```

## CMOS 开关

```verilog
module des (input d, nctrl, pctrl,
			output out);

    cmos (out, d, nctrl, pctrl);
endmodule
```

```verilog
module tb;
    reg d, nctrl, pctrl;
    wire out;

    des u0 (.d(d), .nctrl(nctrl), .pctrl(pctrl), .out(out));

    initial begin
        {d, nctrl, pctrl} <= 0;

        $monitor ("T=%0t d=%0b nctrl=%0b pctrl=%0b out=%0b", $time, d, nctrl, pctrl, out);

        #10 d <= 1;
        #10 nctrl <= 1;
        #10 pctrl <= 1;
        #10 nctrl <= 0;
        #10 pctrl <= 0;
        #10 d <= 0;
        #10;
    end
endmodule
```

仿真日志：

```bash
T=0 d=0 nctrl=0 pctrl=0 out=0
T=10 d=1 nctrl=0 pctrl=0 out=1
T=20 d=1 nctrl=1 pctrl=0 out=1
T=30 d=1 nctrl=1 pctrl=1 out=1
T=40 d=1 nctrl=0 pctrl=1 out=z
T=50 d=1 nctrl=0 pctrl=0 out=1
T=60 d=0 nctrl=0 pctrl=0 out=0
```

## 双向开关

### tran

```verilog
module des (input  io1, ctrl,
            output io2);

    tran (io1, io2);
endmodule
```

```verilog
module tb;
    reg io1, ctrl;
    wire io2;

    des u0 (.io1(io1), .ctrl(ctrl), .io2(io2));

    initial begin
        {io1, ctrl} <= 0;

        $monitor ("T=%0t io1=%0b ctrl=%0b io2=%0b", $time, io1, ctrl, io2);

        #10 io1  <= 1;
        #10 ctrl <= 1;
        #10 ctrl <= 0;
        #10 io1  <= 0;

    end
endmodule
```

仿真日志：

```bash
T=0 io1=0 ctrl=0 io2=0
T=10 io1=1 ctrl=0 io2=1
T=20 io1=1 ctrl=1 io2=1
T=30 io1=1 ctrl=0 io2=1
T=40 io1=0 ctrl=0 io2=0
```

## tranif0

```verilog
module des (input io1, ctrl,
            output io2);
    tranif0 (io1, io2, ctrl);
endmodule
```

仿真日志：

```bash
T=0 io1=0 ctrl=0 io2=0
T=10 io1=1 ctrl=0 io2=1
T=20 io1=1 ctrl=1 io2=z
T=30 io1=1 ctrl=0 io2=1
T=40 io1=0 ctrl=0 io2=0
```

## tranif1

```verilog
module des (input  io1, ctrl,
            output io2);

    tranif1 (io1, io2, ctrl);
endmodule
```

仿真日志：

```bash
T=0 io1=0 ctrl=0 io2=z
T=10 io1=1 ctrl=0 io2=z
T=20 io1=1 ctrl=1 io2=1
T=30 io1=1 ctrl=0 io2=z
T=40 io1=0 ctrl=0 io2=z
```

## 电源和接地

```verilog
module des (output vdd,
			output gnd);

	supply1 _vdd;
	supply0 _gnd;

	assign vdd = _vdd;
	assign gnd = _gnd;
endmodule
```

```verilog
module tb;
    wire vdd, gnd;

    des u0 (.vdd(vdd), .gnd(gnd));

    initial begin
        #10;
        $display ("T=%0t vdd=%0d gnd=%0d", $time, vdd, gnd);
    end
endmodule
```

仿真日志：

```bash
T=10 vdd=1 gnd=0
```

