import cv2

cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    if not ret:
        break
    cv2.imshow('frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()

# for this not need to make cmakelist.txt file, just need to install opencv-python package using pip
# pip install opencv-python
# Also, you not need to make opencv froms source code, just need to install opencv-python package using pip, it will automatically install the pre-built opencv library for you.