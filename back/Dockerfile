FROM python:3.10-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir \
    nanoid \
    fastapi \
    uvicorn \
    sqlalchemy \
    pymysql \
    python-dotenv \
    motor \
    requests \
    cryptography
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
