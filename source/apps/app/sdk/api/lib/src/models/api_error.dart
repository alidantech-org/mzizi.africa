import 'package:json_annotation/json_annotation.dart';

part 'api_error.g.dart';

/// Api Error
@JsonSerializable(includeIfNull: false)
class ApiError {
  const ApiError({
    this.code,
    required this.message,
  });
  final String? code;
  final String message;

  factory ApiError.fromJson(Map<String, dynamic> json) => _$ApiErrorFromJson(json);

  Map<String, dynamic> toJson() => _$ApiErrorToJson(this);
}