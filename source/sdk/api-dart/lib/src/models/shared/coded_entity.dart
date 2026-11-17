import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'coded_entity.g.dart';

/// Base for versioned records with a unique identity code.
@JsonSerializable(includeIfNull: false)
class SharedCodedEntity {
  const SharedCodedEntity({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime updatedAt;
  final int version;

  factory SharedCodedEntity.fromJson(Map<String, dynamic> json) => _$SharedCodedEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCodedEntityToJson(this);
}
