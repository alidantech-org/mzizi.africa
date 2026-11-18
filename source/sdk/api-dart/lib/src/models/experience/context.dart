import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/experience/context_country.dart';
import 'package:mzizi_api/src/models/experience/context_level.dart';
import 'package:mzizi_api/src/models/experience/country_choice.dart';
import 'package:mzizi_api/src/models/experience/place_ref.dart';

part 'context.g.dart';

/// Context
@JsonSerializable(includeIfNull: false)
class ExperienceContext {
  const ExperienceContext({
    required this.chain,
    required this.countries,
    required this.country,
    required this.countrySource,
    required this.gaps,
    required this.languageCode,
    required this.levels,
    this.place,
    required this.rest,
  });
  final List<ExperiencePlaceRef> chain;
  final List<ExperienceCountryChoice> countries;
  final ExperienceContextCountry country;
  final String countrySource;
  final List<String> gaps;
  final String languageCode;
  final List<ExperienceContextLevel> levels;
  final ExperiencePlaceRef? place;
  final List<String> rest;

  factory ExperienceContext.fromJson(Map<String, dynamic> json) => _$ExperienceContextFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceContextToJson(this);
}
