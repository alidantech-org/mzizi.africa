import 'package:json_annotation/json_annotation.dart';
import 'validity_entity.dart';

part 'coded_validity_entity.g.dart';

/// Base for versioned records with a unique identity code and an optional validity period.
@JsonSerializable(includeIfNull: false)
class CodedValidityEntity {
  const CodedValidityEntity({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory CodedValidityEntity.fromJson(Map<String, dynamic> json) => _$CodedValidityEntityFromJson(json);

  Map<String, dynamic> toJson() => _$CodedValidityEntityToJson(this);
}