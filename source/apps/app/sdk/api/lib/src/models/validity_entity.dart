import 'package:json_annotation/json_annotation.dart';
import 'entity.dart';

part 'validity_entity.g.dart';

/// Base for versioned records valid over an optional period.
@JsonSerializable(includeIfNull: false)
class ValidityEntity {
  const ValidityEntity({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory ValidityEntity.fromJson(Map<String, dynamic> json) => _$ValidityEntityFromJson(json);

  Map<String, dynamic> toJson() => _$ValidityEntityToJson(this);
}