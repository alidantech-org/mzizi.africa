import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'identifiers.g.dart';

/// One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer.
@JsonSerializable(includeIfNull: false)
class OfficialIdentifiers {
  const OfficialIdentifiers({
    required this.createdAt,
    this.deletedAt,
    this.entityId,
    required this.id,
    this.individualId,
    this.issuerEntityId,
    this.namespace,
    required this.schemeId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.value,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? entityId;
  final String id;
  final String? individualId;
  final String? issuerEntityId;
  final String? namespace;
  final String schemeId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final String value;
  final int version;

  factory OfficialIdentifiers.fromJson(Map<String, dynamic> json) => _$OfficialIdentifiersFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialIdentifiersToJson(this);
}
