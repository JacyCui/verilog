# Verilog是什么?



在集成电路(integrated circuits)的早期，工程师们不得不坐下来，在纸上手动绘制晶体管(transistor)及其连接，以设计它们，使其可以在硅(silicon)上制造。更大更复杂的电路需要更多的工程师、时间和其他资源，很快就产生了对更好的集成电路设计方法的需求。

不久后，VHDL被开发出来，通过允许工程师描述所需硬件的功能来增强设计过程，并允许自动化工具将该行为转换为实际的硬件元素，如组合门和顺序逻辑。

开发Verilog是为了简化流程并使 **硬件描述语言(Hardware Description Language, HDL)** 更强大、更灵活。今天，Verilog是整个半导体行业使用和最受欢迎的HDL。



## Verilog 有什么用？

Verilog创建了一个抽象层，来隐藏其实现和技术的细节。

例如，D触发器(D flip-flop)的设计需要了解如何组织晶体管以实现上升沿触发，需要考虑将值锁存(latch)在襟翼上所需的上升、下降和clk-Q时间，以及许多其他以技术为导向的细节。功耗(power dissipation)、时耗(timing)以及电路的驱动能力还需要更彻底地了解晶体管的物理性质。

Verilog帮助我们专注于行为(behavior)，其余的待稍后解决。

### 示例

下面的代码展示了Verilog代码的基本样貌。我们会在下一节中涉及更多的和代码相关的细节。暂时来讲，我们先简单地理解，下面的代码描述了一个计数器的行为：

- 如果 `up_down` 为 1 ，则向上计数，否则向下计数；
- 如果 `rstn` 为 0，则重置计数器，这是一个低电平有效的复位(active-low reset)。

```verilog
module ctr (input  				up_down,
								clk,
								rstn,
	        output reg [2:0] 	out);
		
	always @ (posedge clk)
        if (!rstn)
            out <= 0;
    	else begin
        	if (up_down)
            	out <= out + 1;
        	else
            	out <= out - 1;
    	end
endmodule
```

上面的这个简单的例子展示了如何在清晰地指明一个计数器如何工作的情况下隐藏其物理实现上的细节。

`ctr` 是一个表示上升/下降计数器(up/down counter)的 **模块(module)**  ，并且我们可以选择很多的物理实现方式来实现这个模块，并在物理层面做电路面积、能耗上的优化。并且这些物理实现方式通常会被编撰成库，我们可以在EDA工具中选用它们，不过这通常是在设计流程的较后的阶段了。

现在你已经知道了 Verilog 是啥了，下面让我们来学习 Verilog 吧！



