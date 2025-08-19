package main

import (
	"encoding/json"
	"fmt"
	"reflect"
)

type SchemaField struct {
	Name       string `json:"name"`
	Type       string `json:"type"`
	EnumValues []any  `json:"enumValues,omitempty"`
}

// ProcessPacket validates a packet against the given schema
func ProcessPacket(packet string, schema []SchemaField) (bool, error) {
	// Parse packet into a map
	var packetMap map[string]any
	if err := json.Unmarshal([]byte(packet), &packetMap); err != nil {
		return false, fmt.Errorf("failed to parse packet JSON: %w", err)
	}

	// Iterate over schema fields
	for _, field := range schema {
		val, exists := packetMap[field.Name]
		if !exists {
			return false, fmt.Errorf("missing field: %s", field.Name)
		}

		switch field.Type {
		case "string":
			if _, ok := val.(string); !ok {
				return false, fmt.Errorf("field %s is not a string", field.Name)
			}

		case "int":
			// JSON numbers are float64 in Go, so check if it's an integer
			if num, ok := val.(float64); !ok || num != float64(int(num)) {
				return false, fmt.Errorf("field %s is not an int", field.Name)
			}

		case "float":
			if _, ok := val.(float64); !ok {
				return false, fmt.Errorf("field %s is not a float", field.Name)
			}

		case "enum":
			if !contains(field.EnumValues, val) {
				return false, fmt.Errorf("field %s has invalid enum value: %v", field.Name, val)
			}

		case "vec3":
			arr, ok := val.([]interface{})
			if !ok || len(arr) != 3 {
				return false, fmt.Errorf("field %s is not a vec3 of length 3", field.Name)
			}
			for _, v := range arr {
				if _, isNum := v.(float64); !isNum {
					return false, fmt.Errorf("field %s contains non-numeric value: %v", field.Name, v)
				}
			}

		default:
			return false, fmt.Errorf("unknown type: %s", field.Type)
		}
	}

	return true, nil
}

// contains checks if a value exists in a slice
func contains(slice []interface{}, val interface{}) bool {
	for _, v := range slice {
		if reflect.DeepEqual(v, val) {
			return true
		}
	}
	return false
}
