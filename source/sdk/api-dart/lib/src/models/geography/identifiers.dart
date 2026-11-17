import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'identifiers.g.dart';

/// A preserved identifier assigned to a feature by an external geographic registry or source system.
@JsonSerializable(includeIfNull: false)
class GeographyIdentifiers {
  const GeographyIdentifiers({
    required this.createdAt,
    this.deletedAt,
    required this.externalId,
    required this.featureId,
    required this.id,
    required this.identifierSchemeId,
    this.namespace,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String externalId;
  final String featureId;
  final String id;
  final String identifierSchemeId;
  final String? namespace;
  final DateTime updatedAt;
  final int version;

  factory GeographyIdentifiers.fromJson(Map<String, dynamic> json) => _$GeographyIdentifiersFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyIdentifiersToJson(this);
}
