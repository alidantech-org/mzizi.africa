import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'instruments.g.dart';

/// Stable instrument identity, independent of its names, editions, downloads and languages.
@JsonSerializable(includeIfNull: false)
class LegalInstruments {
  const LegalInstruments({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.enactedOn,
    required this.id,
    this.issuingEntityId,
    this.issuingUnitId,
    required this.kindId,
    this.publishedOn,
    this.statusId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? enactedOn;
  final String id;
  final String? issuingEntityId;
  final String? issuingUnitId;
  final String kindId;
  final DateTime? publishedOn;
  final String? statusId;
  final DateTime updatedAt;
  final int version;

  factory LegalInstruments.fromJson(Map<String, dynamic> json) => _$LegalInstrumentsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentsToJson(this);
}
