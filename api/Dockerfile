FROM --platform=linux/amd64 python:3.9-slim

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y \
        pkg-config python3-dev ffmpeg libsm6 libxext6 libglib2.0-0 \
        libgtk2.0-0 libgl1-mesa-glx libhdf5-dev libhdf5-serial-dev \
        hdf5-tools build-essential gcc libxrender1 && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

ENV PYTHONUNBUFFERED=1

CMD ["python3", "-u", "app.py"]