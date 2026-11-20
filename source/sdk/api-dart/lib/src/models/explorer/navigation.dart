import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/country_choice.dart';
import 'package:mzizi_api/src/models/explorer/navigation_item.dart';

part 'navigation.g.dart';

/// Navigation
@JsonSerializable(includeIfNull: false)
class ExplorerNavigation {
  const ExplorerNavigation({required this.country, required this.gaps, required this.items});
  final ExplorerCountryChoice country;
  final List<String> gaps;
  final List<ExplorerNavigationItem> items;

  factory ExplorerNavigation.fromJson(Map<String, dynamic> json) => _$ExplorerNavigationFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerNavigationToJson(this);
}
