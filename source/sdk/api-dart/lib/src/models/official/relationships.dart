import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_validity_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'relationships.g.dart';

/// One directed typed relationship between exactly two Official identities, optionally with an ownership share.
@JsonSerializable(includeIfNull: false)
class OfficialRelationships {
  const OfficialRelationships({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fromEntityId,
    this.fromIndividualId,
    required this.id,
    required this.kindId,
    this.sharePercentage,
    this.sourceCitationId,
    this.toEntityId,
    this.toIndividualId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? fromEntityId;
  final String? fromIndividualId;
  final String id;
  final String kindId;
  final double? sharePercentage;
  final String? sourceCitationId;
  final String? toEntityId;
  final String? toIndividualId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory OfficialRelationships.fromJson(Map<String, dynamic> json) => _$OfficialRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialRelationshipsToJson(this);
}
