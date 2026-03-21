# Thresholding Operations using inRange

|                 |                |
| --------------- | -------------- |
| Original author | Lorena García  |
| Compatibility   | Rishiraj Surti |

## Goal

In this tutorial you will learn how to:

- Perform basic thresholding operations using OpenCV @ref `cv::inRange` function.
- Detect an object based on the range of pixel values in the HSV colorspace.

## Theory

- In the previous tutorial, we learnt how to perform thresholding using @ref `cv::threshold` function.
- In this tutorial, we will learn how to do it using @ref `cv::inRange` function.
- The concept remains the same, but now we add a range of pixel values we need.

## HSV colorspace

[HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)

(hue, saturation, value) colorspace is a model to represent the colorspace similar to the RGB color model. Since the hue channel models the color type, it is very useful in image processing tasks that need to segment objects
based on its color. Variation of the saturation goes from unsaturated to represent shades of gray and fully saturated (no white component). Value channel describes the brightness or the intensity of the
color. Next image shows the HSV cylinder.

![By SharkDderivative work: SharkD [CC BY-SA 3.0 or GFDL], via Wikimedia Commons](/docs/images/Threshold_inRange_HSV_colorspace.jpg)

Since colors in the RGB colorspace are coded using the three channels, it is more difficult to segment
an object in the image based on its color.

![By SharkD [GFDL or CC BY-SA 4.0], from Wikimedia Commons](/docs/images/Threshold_inRange_RGB_colorspace.jpg)

Formulas used to convert from one colorspace to another colorspace using @ref cv::cvtColor function
are described in @ref imgproc_color_conversions

## Code

:::code

:::include{docs/code/cpp/Threshold_inRange.cpp}

:::include{docs/code/java/ThresholdInRange.java}

:::include{docs/code/python/threshold_inRange.py}

:::

## Explanation

Let's check the general structure of the program:

- Capture the video stream from default or supplied capturing device.

:::code

:::include{docs/code/cpp/Threshold_inRange.cpp#L59}

:::include{docs/code/java/ThresholdInRange.java#L54}

:::include{docs/code/python/threshold_inRange.py#L73}

:::

- Create a window to display the default frame and the threshold frame.

:::code

:::include{docs/code/cpp/Threshold_inRange.cpp#L62-L65}

:::include{docs/code/java/ThresholdInRange.java#L66-L74}

:::include{docs/code/python/threshold_inRange.py#L76-L78}

:::

- Create the trackbars to set the range of HSV values

:::code

:::include{docs/code/cpp/Threshold_inRange.cpp#L69-L74}

:::include{docs/code/java/ThresholdInRange.java#L127-L173}

:::include{docs/code/python/threshold_inRange.py#L82-L87}

:::

- Until the user want the program to exit do the following

:::code

:::include{docs/code/cpp/Threshold_inRange.cpp#L78-L90}

:::include{docs/code/java/ThresholdInRange.java#L89-L115}

:::include{docs/code/python/threshold_inRange.py#L90-l98}

:::

- Show the images

:::code

:::include{docs/code/cpp/Threshold_inRange.cpp#L93-L96}

:::include{docs/code/java/ThresholdInRange.java#L240-L243}

:::include{docs/code/python/threshold_inRange.py#L100-l103}

:::

- For a trackbar which controls the lower range, say for example hue value:

:::code

:::include{docs/code/cpp/Threshold_inRange.cpp#L17-L21}

:::include{docs/code/java/ThresholdInRange.java#L176-L184}

:::include{docs/code/python/threshold_inRange.py#L23-l28}

:::

- For a trackbar which controls the upper range, say for example hue value:

:::code

:::include{docs/code/cpp/Threshold_inRange.cpp#L25-L29}

:::include{docs/code/java/ThresholdInRange.java#L187-L194}

:::include{docs/code/python/threshold_inRange.py#L32-l37}

:::

- It is necessary to find the maximum and minimum value to avoid discrepancies such as
  the high value of threshold becoming less than the low value.

## Results

- After compiling this program, run it. The program will open two windows

- As you set the range values from the trackbar, the resulting frame will be visible in the other window.

![r1](/docs/images/Threshold_inRange_Tutorial_Result_input.jpeg)

![r2](/docs/images/Threshold_inRange_Tutorial_Result_output.jpeg)
