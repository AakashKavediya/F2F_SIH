FROM python:3.13

COPY . /app

WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE $PORT

CMD uvicorn app.main:app --host