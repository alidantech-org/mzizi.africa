import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'validity_entity.g.dart';

/// Base for versioned records valid over an optional period.
@JsonSerializable(includeIfNull: false)
class SharedValidityEntity {
  const SharedValidityEntity({
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

  factory SharedValidityEntity.fromJson(Map<String, dynamic> json) => _$SharedValidityEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedValidityEntityToJson(this);
}
