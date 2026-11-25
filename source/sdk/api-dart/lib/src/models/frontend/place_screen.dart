import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/frontend/article_link.dart';
import 'package:mzizi_api/src/models/frontend/country_link.dart';
import 'package:mzizi_api/src/models/frontend/event_link.dart';
import 'package:mzizi_api/src/models/frontend/figure.dart';
import 'package:mzizi_api/src/models/frontend/language_option.dart';
import 'package:mzizi_api/src/models/frontend/leader.dart';
import 'package:mzizi_api/src/models/frontend/place_link.dart';
import 'package:mzizi_api/src/models/frontend/project_link.dart';

part 'place_screen.g.dart';

/// Place Screen
@JsonSerializable(includeIfNull: false)
class FrontendPlaceScreen {
  const FrontendPlaceScreen({
    required this.articles,
    required this.breadcrumb,
    required this.children,
    required this.country,
    required this.events,
    required this.figures,
    required this.language,
    required this.languages,
    required this.leaders,
    required this.place,
    required this.projects,
  });
  final List<FrontendArticleLink> articles;
  final List<FrontendPlaceLink> breadcrumb;
  final List<FrontendPlaceLink> children;
  final FrontendCountryLink country;
  final List<FrontendEventLink> events;
  final List<FrontendFigure> figures;
  final String language;
  final List<FrontendLanguageOption> languages;
  final List<FrontendLeader> leaders;
  final FrontendPlaceLink place;
  final List<FrontendProjectLink> projects;

  factory FrontendPlaceScreen.fromJson(Map<String, dynamic> json) => _$FrontendPlaceScreenFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendPlaceScreenToJson(this);
}
