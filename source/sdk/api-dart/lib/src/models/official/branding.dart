import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_validity_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'branding.g.dart';

/// How an entity or person presents itself: slogan, colours, a symbol or logo, a portrait. Words go in `value`; images and recordings are filesystem media that mention the entity or person.
@JsonSerializable(includeIfNull: false)
class OfficialBranding {
  const OfficialBranding({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.entityId,
    required this.id,
    this.individualId,
    required this.kindId,
    required this.languageId,
    this.sourceCitationId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    this.value,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? entityId;
  final String id;
  final String? individualId;
  final String kindId;
  final String languageId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final String? value;
  final int version;

  factory OfficialBranding.fromJson(Map<String, dynamic> json) => _$OfficialBrandingFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialBrandingToJson(this);
}
