from fastapi import HTTPException

def safe_transform(encoder, value: str, field_name: str):
    """LabelEncoder.transform but raises a clean 400 for unseen categories."""
    try:
        return int(encoder.transform([value])[0])
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid value '{value}' for '{field_name}'. "
            f"Allowed values: {list(encoder.classes_)}",
        )