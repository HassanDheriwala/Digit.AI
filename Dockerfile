FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose HF Spaces port
EXPOSE 7860

# Run the app
CMD ["python", "app.py"]