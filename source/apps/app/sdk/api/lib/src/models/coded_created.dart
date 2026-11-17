import 'package:json_annotation/json_annotation.dart';
import 'coded_identified.dart';

part 'coded_created.g.dart';

/// Base for operational records with a unique identity code and creation time.
@JsonSerializable(includeIfNull: false)
class CodedCreated {
  const CodedCreated({
    required this.code,
    required this.createdAt,
    required this.id,
  });
  final String code;
  final DateTime createdAt;
  final String id;

  factory CodedCreated.fromJson(Map<String, dynamic> json) => _$CodedCreatedFromJson(json);

  Map<String, dynamic> toJson() => _$CodedCreatedToJson(this);
}