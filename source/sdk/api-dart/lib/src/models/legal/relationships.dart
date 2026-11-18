import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/legal/wordings.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'relationships.g.dart';

/// A substantive legal operation or hierarchy link between wordings or instruments. Source derivation is not recorded here.
@JsonSerializable(includeIfNull: false)
class LegalRelationships {
  const LegalRelationships({
    this.affectedWordingId,
    this.authorityWordingId,
    this.citationId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.effectiveOn,
    this.explanation,
    required this.id,
    required this.kindId,
    this.objectInstrumentId,
    this.resultingWordingId,
    this.subjectInstrumentId,
    required this.updatedAt,
    required this.version,
  });
  final String? affectedWordingId;
  final String? authorityWordingId;
  final String? citationId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? effectiveOn;
  final String? explanation;
  final String id;
  final String kindId;
  final String? objectInstrumentId;
  final String? resultingWordingId;
  final String? subjectInstrumentId;
  final DateTime updatedAt;
  final int version;

  factory LegalRelationships.fromJson(Map<String, dynamic> json) => _$LegalRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalRelationshipsToJson(this);
}
