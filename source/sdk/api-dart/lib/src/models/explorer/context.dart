import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/country_choice.dart';
import 'package:mzizi_api/src/models/explorer/level.dart';
import 'package:mzizi_api/src/models/explorer/place.dart';

part 'context.g.dart';

/// Context
@JsonSerializable(includeIfNull: false)
class ExplorerContext {
  const ExplorerContext({
    required this.chain,
    required this.country,
    required this.gaps,
    required this.language,
    required this.levels,
    required this.place,
  });
  final List<ExplorerPlace> chain;
  final ExplorerCountryChoice country;
  final List<String> gaps;
  final String language;
  final List<ExplorerLevel> levels;
  final ExplorerPlace place;

  factory ExplorerContext.fromJson(Map<String, dynamic> json) => _$ExplorerContextFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerContextToJson(this);
}
