import 'package:json_annotation/json_annotation.dart';
import 'identified.dart';

part 'coded_identified.g.dart';

/// Base for operational records with a unique identity code.
@JsonSerializable(includeIfNull: false)
class CodedIdentified {
  const CodedIdentified({
    required this.code,
    required this.id,
  });
  final String code;
  final String id;

  factory CodedIdentified.fromJson(Map<String, dynamic> json) => _$CodedIdentifiedFromJson(json);

  Map<String, dynamic> toJson() => _$CodedIdentifiedToJson(this);
}