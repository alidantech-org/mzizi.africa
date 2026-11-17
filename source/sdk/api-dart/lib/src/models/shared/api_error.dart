import 'package:json_annotation/json_annotation.dart';

part 'api_error.g.dart';

/// Api Error
@JsonSerializable(includeIfNull: false)
class SharedApiError {
  const SharedApiError({this.code, required this.message});
  final String? code;
  final String message;

  factory SharedApiError.fromJson(Map<String, dynamic> json) => _$SharedApiErrorFromJson(json);

  Map<String, dynamic> toJson() => _$SharedApiErrorToJson(this);
}
