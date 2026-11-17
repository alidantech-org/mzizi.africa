import 'package:json_annotation/json_annotation.dart';
import 'entity.dart';
import 'features.dart';
import 'value.dart';

part 'identifiers.g.dart';

/// A preserved identifier assigned to a feature by an external geographic registry or source system.
@JsonSerializable(includeIfNull: false)
class Identifiers {
  const Identifiers({
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

  factory Identifiers.fromJson(Map<String, dynamic> json) => _$IdentifiersFromJson(json);

  Map<String, dynamic> toJson() => _$IdentifiersToJson(this);
}