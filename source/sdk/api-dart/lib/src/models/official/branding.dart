import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'branding.g.dart';

/// Words and colours of a named thing (slogan, motto, party colours); images are `media`.
@JsonSerializable(includeIfNull: false)
class OfficialBranding {
  const OfficialBranding({
    this.colors,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityId,
    required this.kindTerm,
    this.languageId,
    this.text,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final List<String>? colors;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String identityId;
  final String kindTerm;
  final String? languageId;
  final String? text;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory OfficialBranding.fromJson(Map<String, dynamic> json) => _$OfficialBrandingFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialBrandingToJson(this);
}
