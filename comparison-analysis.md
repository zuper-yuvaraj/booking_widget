# Custom Fields vs Object Value Comparison

## Mapping & Differences

| Key | Array Value | Object Value | Match | Notes |
|-----|-------------|--------------|-------|-------|
| **one** | N/A | `3430bab1-2830-46c7-8710-e54f63c418dc` | ❌ | **MISSING** - Object has UUID that's not in custom_fields array |
| **two** | `Testt` | `Testt` | ✅ | Perfect match |
| **three** | `["Roof Repair", "Specialty Shingle Roof Installation"]` | `Roof Repair,Specialty Shingle Roof Installation` | ⚠️ | **FORMAT DIFFERENCE** - Array vs comma-separated string; values match |
| **four** | `Yes` | `Yes` | ✅ | Perfect match |
| **five** | `Testt` | `Testt` | ✅ | Perfect match |
| **six** | `Less than one month` | `Less than one month` | ✅ | Perfect match |
| **seven** | `Quick Patch` | `Quick Patch` | ✅ | Perfect match |
| **eight** | `10-15 years` | `10-15 years` | ✅ | Perfect match |
| **nine** | `["Asphalt Shingle", "Metal"]` | `Metal,Asphalt Shingle` | ⚠️ | **FORMAT & ORDER DIFFERENCE** - Array vs comma-separated string; different order (Metal first in object vs last in array) |

## Summary of Differences

### 1. **Missing Field (Key "one")**
   - The object contains `"one": "3430bab1-2830-46c7-8710-e54f63c418dc"` (a UUID)
   - This value does not exist in the `custom_fields` array
   - This appears to be a separate identifier, possibly a booking/lead ID

### 2. **Format Differences**
   - **Key "three"**: Array in custom_fields → Comma-separated string in object
     - Array: `["Roof Repair", "Specialty Shingle Roof Installation"]`
     - Object: `Roof Repair,Specialty Shingle Roof Installation`
     - **Values are identical, just different format**

   - **Key "nine"**: Array in custom_fields → Comma-separated string in object + **different order**
     - Array: `["Asphalt Shingle", "Metal"]`
     - Object: `Metal,Asphalt Shingle`
     - **Values are the same but order is reversed** (Metal and Asphalt Shingle swapped)

## Conclusion

| Issue | Severity | Impact |
|-------|----------|--------|
| Missing "one" key | High | Must investigate where this UUID comes from |
| Format difference (arrays → strings) | Medium | May need format conversion/normalization |
| Order difference in "nine" | Low | Same values, just reordered; verify if order matters for your use case |
