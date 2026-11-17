import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/locality/language_choice.dart';

part 'language_list.g.dart';

/// Language List
@JsonSerializable(includeIfNull: false)
class LocalityLanguageList {
  const LocalityLanguageList({required this.languages});
  final List<LocalityLanguageChoice> languages;

  factory LocalityLanguageList.fromJson(Map<String, dynamic> json) => _$LocalityLanguageListFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityLanguageListToJson(this);
}
