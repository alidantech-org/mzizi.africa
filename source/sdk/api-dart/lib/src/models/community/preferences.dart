import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/theme_choice.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'preferences.g.dart';

/// An actor's saved country, language, theme and home place.
@JsonSerializable(includeIfNull: false)
class CommunityPreferences {
  const CommunityPreferences({
    required this.actorId,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.homeFeatureId,
    required this.id,
    this.languageId,
    this.theme,
    required this.updatedAt,
    required this.version,
  });
  final String actorId;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? homeFeatureId;
  final String id;
  final String? languageId;
  final CommunityThemeChoice? theme;
  final DateTime updatedAt;
  final int version;

  factory CommunityPreferences.fromJson(Map<String, dynamic> json) => _$CommunityPreferencesFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityPreferencesToJson(this);
}
