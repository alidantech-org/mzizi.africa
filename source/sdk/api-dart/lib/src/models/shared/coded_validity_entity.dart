import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/validity_entity.dart';

part 'coded_validity_entity.g.dart';

/// Base for versioned records with a unique identity code and an optional validity period.
@JsonSerializable(includeIfNull: false)
class SharedCodedValidityEntity {
  const SharedCodedValidityEntity({
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

  factory SharedCodedValidityEntity.fromJson(Map<String, dynamic> json) => _$SharedCodedValidityEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCodedValidityEntityToJson(this);
}
